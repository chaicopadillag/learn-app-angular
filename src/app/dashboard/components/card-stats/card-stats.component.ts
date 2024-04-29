import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faIcons } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-card-stats',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './card-stats.component.html',
  styleUrl: './card-stats.component.css',
})
export class CardStatsComponent {
  @Input() title = '';
  @Input() total = '';
  @Input() subtitle = '';
  @Input() icon: IconDefinition = faIcons;
}
