<script lang="ts">
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import { myToast } from '../UIs';

  class CustomToast extends myToast{
    // properti
    private toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true, 
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    // Konstruktor
    constructor(judul: string = "", teks: string = "", tipe: string = ""){
      super(judul, teks, tipe);
    }
    // method show toast
    public show(){
      this.toast.fire({
        icon: this.tipe != 'success' ? 'error' : 'success',
        title: this.judul,
      })
    }
  }

  // instansiasi objek toast
  let toast_success:myToast = new CustomToast("Berhasil signup!!", "", "success");
  let toast_failed:myToast = new CustomToast("Gagal signup :(", "", "error");
  // deklarasi objek signup
  let signup_obj = {
    nama: '',
    alamat: '',
    telpon: '',
    email: '',
    username: '',
    password: '',
    tgllahir: ''
  }

  let pass: string;

  async function signup(){
    try {
      let txtpass:string = '';
      // txtpass = encryptPW(signup_obj.password);
      const response = await axios.post('https://cek-kosmu-server.herokuapp.com/users/signup', {
        nama: signup_obj.nama,
        alamat: signup_obj.alamat,
        telpon: signup_obj.telpon,
        email: signup_obj.email,
        username: signup_obj.username,
        password: signup_obj.password,
        tgllahir: signup_obj.tgllahir
      });
      let res = response.data;
      console.log(res);
      if(res.message == "Berhasil menambahkan user baru :)"){
        toast_success.show();
        setTimeout( function(){
          window.open('http://localhost:5000/user/login', '_self');
        }, 4000);
      }
    } catch (error) {
      toast_failed.judul = error;
      toast_failed.show();
    }
  }

  async function sha256(plain: string) {
    // encode as UTF-8
    const plainBuffer = new TextEncoder().encode(plain);
    // hash plaintext
    const hashBuffer = await crypto.subtle.digest('SHA-256', plainBuffer);
    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // convert bytes to hex string
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hashHex;
  }

  function encryptPW(plaintext: string){
    try {
      let pass: string = '';
      sha256(plaintext).then(hash => pass = hash);
      return pass;
    } catch (error) {
      console.log(error);
    }
  }


</script>

<div class="d-flex justify-content-center mt-4">
  <div class="card shadow card-bg mb-2" style="width: 45rem; margin-top: 70px">
    <div class="card-body">
      <h3 class="card-title text-center mb-4">User Signup</h3>
      <div class="row text-left">
        <div class="col-6">
          <label for="" class="forn-label">Nama</label>
          <input type="text" class="form-control" id="txtnama" bind:value={signup_obj.nama}>
        </div>
        <div class="col-6">
          <label for="" class="form-label">Email</label>
          <input type="email" class="form-control" id="txtemail" bind:value={signup_obj.email}>
        </div>
      </div>
      <div class="row text-left">
        <div class="col-6">
          <label for="" class="forn-label">TTL</label>
          <input type="text" class="form-control" id="txtTTL" bind:value={signup_obj.tgllahir}>
        </div>
        <div class="col-6">
          <label for="" class="form-label">No. Telpon</label>
          <input type="text" class="form-control" id="txtnotelp" bind:value={signup_obj.telpon}>
        </div>
      </div>
      <div class="row text-left">
        <div class="col-6">
          <label for="" class="forn-label">Alamat</label>
          <input type="text" class="form-control" id="txtalamat" bind:value={signup_obj.alamat}>
        </div>
        <div class="col-6">
          <label for="" class="form-label">Username</label>
          <input type="text" class="form-control" id="txtusername" bind:value={signup_obj.username}>
        </div>
      </div>
      <div class="row text-left mb-3">
        <div class="col-6">
          <label for="" class="forn-label">Jenis Kelamin</label>
          <input type="text" class="form-control" id="txtJK">
        </div>
        <div class="col-6">
          <label for="" class="form-label">Password</label>
          <input type="password" class="form-control" id="txtpassword" bind:value={signup_obj.password}>
        <p>{pass}</p>
        </div>
      </div>
      <div class="mb-3">
        <button
          type="button"
          class="btn btn-success mb-1"
          on:click={signup}>Signup</button>
        <p>
          Sudah punya akun?
          <a href="http://localhost:5000/user/login">Login disini</a>
        </p>
      </div>
    </div>
  </div>
</div>
