import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private _showModal = false;

  get showModal() {
    return this._showModal;
  }

  openModal() {
    this._showModal = true;
  }

  closeModal() {
    this._showModal = false;
  }
}
