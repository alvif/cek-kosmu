export abstract class Pengguna{
  protected _nama: string;
  protected _alamat: string
  protected _username: string;
  protected _password: string;
  protected _email: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;

  abstract signup();
  abstract cekLogin();

  set nama(txtnama: string){
    this._nama = txtnama;
  }

  get nama(){
    return this._nama;
  }

  set alamat(txtalamat: string){
    this._nama = txtalamat;
  }

  get alamat(){
    return this._alamat;
  }


  set username(txtusername: string){
    this._username = txtusername;
  }

  get username(){
    return this._username;
  }


  set password(pw: string){
    this._password = pw;
  }

  get password(){
    return this._password;
  }


  set email(txtemail: string){
    this._nama = txtemail;
  }

  get email(){
    return this._email;
  }


  set createdAt(tgl: Date){
    this._createdAt = this.createdAt;
  }

  get createdAt(){
    return this._createdAt;
  }


  set updatedAt(tgl: Date){
    this._updatedAt = tgl;
  }

  get updatedAt(){
    return this._updatedAt;
  }
}

export abstract class Admin extends Pengguna{
  private id_admin: number;

  constructor(id: number){
    super();
    this.id_admin = id;
  }
  
  abstract konfirmasiPemesanan(id_pemesanan: number, id_kos: number, opsi: string);

  public signup(){

  };
  public cekLogin(){
    
  };
}

export class Owner extends Pengguna{
  public signup(){

  };
  public cekLogin(){

  };
}

export class Users extends Pengguna{
  public signup(){

  };
  public cekLogin(){

  };
}
