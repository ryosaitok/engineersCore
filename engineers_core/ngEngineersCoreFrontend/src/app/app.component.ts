import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  userId: number;
  accountName: string;
  userName: string;
  profileImageLink: string;
  description: string;
  isLoggedIn: boolean;
  clicked = false;

  constructor() {
  }

  isDoubleClick(): boolean {
    if (this.clicked) {
      // ボタンが押されている場合はsubmitしない
      return true;
    } else {
      // ボタンが押されていなければ、ボタンが押されている状態にした上でsubmitする
      this.clicked = true;
      return false;
    }
  }

  async makeClickable() {
    // すぐにクリックできるようにするとクリックされてしまうから、クリックできる状態にするまで間隔をあける。
    await this.wait(3);
    this.clicked = false;
  }

  async wait(sec) {
    await this.sleep(sec);
  }

  sleep(sec): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
  }
}
