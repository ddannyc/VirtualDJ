/**
  This file is part of Web Virtual DJ.

Web Virtual DJ is free software: you can redistribute it and / or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

Web Virtual DJ is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.See the
GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
along with Web Virtual DJ.If not, see < https://www.gnu.org/licenses/>.
*/
import { Component, OnInit } from '@angular/core';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-help',
  templateUrl: './app-help.component.html',
  styleUrls: ['./app-help.component.css']
})
export class AppHelpComponent {
  constructor(private helpService: HelpService) {}

  help(helpquery) {
    this.helpService.save(helpquery);
    setTimeout(() => {
      this.helpService.save(null);
    }, 1000);
  }
}
