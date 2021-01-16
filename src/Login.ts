export class Login{
  protected result;
  private _login_state: number;
  private _username: string;
  private _password: string;
  private _lvl: string;
  private LOGIN_API_URL: string;

  constructor(username:string, password: string, url: string){
    // this._username = this.validasiUser(username) ? username : '';
    this._username = username;
    this._password = password;
    this.LOGIN_API_URL = url;
  }

  private validasiUser(username:string){
    return username != '';
  }

  public doLogin(level:string){
    switch (level) {
      case 'user':
        this.Login(this.username, this.password, level);
        break;
      case 'owner':
        this.Login(this.username, this.password, level);
        break;
      case 'admin':
        this.Login(this.username, this.password, level);
        break;
      default:
        break;
    }
  }

  private async Login(username: string, password: string, level:string) {
    try {
      const response = await fetch(this.LOGIN_API_URL, {
        method: "POST",
        body: JSON.stringify({ username: username, password: password}),
        headers: {"Content-type": "application/x-www-form-urlencoded"}
      });
      let hasil = await response.json();
      if(hasil.message == "Berhasil login"){
        window.open(`http://localhost:5000/${level}/dasbor`, "_self");
        // set localStorage
        this.loginSession(level);
      }else{
        this.login_state = 0;
      }
    } catch (error) {
        this.login_state = 0;
    }
  }

  protected loginSession(level: string){
     // set localStorage
     localStorage.setItem(level, this.result.token);
     localStorage.setItem(this.username, this.result.username);
     localStorage.setItem('login', level);
  }

  protected clearSession(){
    localStorage.clear();
  }

  set username(uname: string){
    this._username = uname;
  }

  get username(){
    return this._username;
  }

  set password(pass: string){
    this._password = pass;
  }

  set lvl(level: string){
    this._lvl = level;
  }

  set apiURL(url: string){
    this.LOGIN_API_URL = url;
  }

  set login_state(num: number){
    switch (num) {
      case 0:
        this._login_state = 0;
        break;
      case 1:
        this._login_state = 1;
        break;
      case 2:
        this._login_state = 2;
        break;
      default:
        this._login_state = -1;
        break;
    }
  }

  get res(){
    return this.result;
  }
}