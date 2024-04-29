import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '@services/users.service';
import { filter, switchMap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.css',
})
export default class FormUserComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  isPosting = false;

  get user() {
    return this.usersService.user();
  }

  get titleForm() {
    return this.user?.id ? 'Actualizando Usario' : 'Creando usuario';
  }

  constructor() {
    this.updateValidations();

    this.form.controls['role'].valueChanges.subscribe(() => {
      this.updateValidations();
    });
  }

  form = this.fb.group(
    {
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      role: ['student', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(255)],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      age: ['', []],
      idCard: ['', []],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{8,}$/),
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      passwordConfirmation: ['', [Validators.required]],
    },
    { validators: [this.passwordMatchValidator()] }
  );

  ngOnInit(): void {
    this.activeRoute.params
      .pipe(
        filter(({ id }) => !!id),
        switchMap(({ id }) => this.usersService.getUserById(id))
      )
      .subscribe({
        next: () => {
          this.form.patchValue(this.user ?? {});
          this.form.controls['password'].clearValidators();
          this.form.controls['passwordConfirmation'].clearValidators();
          this.form.controls['password'].updateValueAndValidity();
          this.form.controls['passwordConfirmation'].updateValueAndValidity();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isPosting) return;

    this.isPosting = true;

    if (this.user?.id) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  createUser() {
    this.usersService.userRegister(this.form.value as any).subscribe({
      next: ({ message }) => {
        Swal.fire('Bien!', message, 'success');
        this.form.reset();
        this.isPosting = false;
        this.router.navigateByUrl(`/dashboard/users/${this.user?.id}/show`);
      },
      error: (err) => {
        this.isPosting = false;
        Swal.fire('Upz!', err, 'error');
      },
    });
  }

  updateUser() {
    this.usersService
      .updateUser(this.user?.id!, this.form.value as any)
      .subscribe({
        next: ({ message }) => {
          Swal.fire('Bien!', message, 'success');
          this.isPosting = false;
          this.router.navigateByUrl(`/dashboard/users/${this.user?.id}/show`);
        },
        error: (error) => {
          this.isPosting = false;
          Swal.fire('Upz!', error, 'error');
        },
      });
  }

  isValid(field: string) {
    return (
      this.form.get(field)?.errors &&
      this.form.controls[field as 'name'].touched
    );
  }

  updateValidations() {
    const role = this.form.get('role')?.value;

    if (role === 'student') {
      this.form.controls['lastName'].setValidators([Validators.maxLength(100)]);
      this.form.controls['age'].setValidators([
        Validators.required,
        Validators.min(18),
      ]);
      this.form.controls['idCard'].setValidators([
        Validators.required,
        Validators.pattern(/[0-9]/),
        Validators.minLength(11),
        Validators.maxLength(11),
      ]);
    } else {
      this.form.controls['lastName'].setValidators([
        Validators.required,
        Validators.maxLength(100),
      ]);
      this.form.controls['age'].clearValidators();
      this.form.controls['idCard'].clearValidators();
    }
    this.form.controls['lastName'].updateValueAndValidity();
    this.form.controls['age'].updateValueAndValidity();
    this.form.controls['idCard'].updateValueAndValidity();
  }

  passwordMatchValidator() {
    return (formGroup: FormGroup) => {
      const password = formGroup.get('password');
      const confirmPassword = formGroup.get('passwordConfirmation');
      if (password?.value !== confirmPassword?.value) {
        confirmPassword?.setErrors({ passwordMismatch: true });
      } else {
        confirmPassword?.setErrors(null);
      }
    };
  }

  getError(field: string) {
    const errors = this.form.get(field)?.errors;
    if (errors) {
      if (errors.required) {
        return 'Este campo es requerido.';
      }
      if (errors.email) {
        return 'Ingrese una dirección de correo electrónico válida.';
      }
      if (errors.minlength) {
        return `Debe tener al menos ${errors.minlength.requiredLength} caracteres.`;
      }
      if (errors.maxlength) {
        return `No debe exceder los ${errors.maxlength.requiredLength} caracteres.`;
      }
      if (errors.min) {
        return `Debe ser mayor o igual a ${errors.min.min}.`;
      }
      if (errors.max) {
        return `Debe ser menor o igual a ${errors.max.max}.`;
      }

      if (errors.pattern && field === 'idCard') {
        return 'Debe ser solo numeros.';
      }

      if (errors.pattern && field === 'password') {
        return 'Minimo 8 caracteres, número, mayúscula y especial';
      }
      if (errors?.passwordMismatch) {
        return 'Las contraseñas no cuenciden';
      }
    }
    return '';
  }
}
