<script lang="ts">
  import Verifikasi from "./components.verifikasi.kos.svelte";
  import Pemesanan from "./components.pemesanan.svelte";
  import Histori from "./components.histori.svelte";
  import { myToast } from "../UIs";
  import Swal from "sweetalert2";
  import store from '../loginContext';

  class Toast extends myToast {
    // Properti
    private toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    // Konstruktor
    constructor(judul: string, teks: string, tipe: string) {
      super(judul, teks, tipe);
    }
    // method untuk menampilkan toast
    public show() {
      this.toast.fire({
        icon: this.tipe != "success" ? "error" : "success",
        title: this.judul,
      });
    }
    // method untuk ambil waktu saat ini
    public getTime() {
      let waktu: Date;
      let w_panjang: string;
      let jam: number;

      waktu = new Date();
      w_panjang = waktu.toTimeString();
      jam = parseInt(w_panjang.slice(0, 2));

      if (jam >= 0 && jam <= 11) {
        return "pagi";
      } else if (jam >= 12 && jam <= 18) {
        return "siang";
      } else {
        return "malam";
      }
    }
  }

  let sesi: string;
  let component = Verifikasi;
  sesi = localStorage.getItem("nama_admin");

  function pilihComponent(n: number) {
    if (n == 1) {
      component = Verifikasi;
    } else if (n == 2) {
      component = Pemesanan;
    } else {
      component = Histori;
    }
  }

  function getTime() {
    let waktu: Date;
    let w_panjang: string;
    let jam: number;

    waktu = new Date();
    w_panjang = waktu.toTimeString();
    jam = parseInt(w_panjang.slice(0, 2));

    if (jam >= 0 && jam <= 11) {
      return "pagi";
    } else if (jam >= 12 && jam <= 18) {
      return "siang";
    } else {
      return "malam";
    }
  }

  let w: string = getTime();
  let nama: string = localStorage.getItem('nama_admin');
  let welcome_toast: myToast = new Toast(
    `Selamat ${w}, ${nama} :)`,
    "",
    "success"
  );
  
  if(nama != undefined){
    welcome_toast.show();
  }
</script>

<style>
  .admin {
    margin-top: 100px;
  }
  .card-header, .card-header-tabs{
    background-color: #FFD38D;
  }
  .nav-link{
    color: #725232;
  }
</style>

<div class="admin">
  <div class="card text-center">
    <div class="card-header">
      <ul class="nav nav-tabs card-header-tabs" id="myTab">
        <li class="nav-item">
          <a
            class="nav-link active"
            href="#verifikasi"
            on:click={() => pilihComponent(1)}>Pendaftaran Kos</a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            href="#pemesanan"
            on:click={() => pilihComponent(2)}>Pemesanan</a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            href="#histori"
            on:click={() => pilihComponent(3)}>Pembayaran</a>
        </li>
      </ul>
    </div>
    <div class="card-body">
      <svelte:component this={component} />
    </div>
  </div>
</div>
