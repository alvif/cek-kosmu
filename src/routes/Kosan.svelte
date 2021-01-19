<script lang="ts">
  import { Users } from "../User";
  import { onMount } from "svelte";
  import { myAlert } from "../UIs";
  import Swal from "sweetalert2";

  let kosan = [];
  let selected_kosan = [];
  let sewa_kos = {
    id_kos: 0,
    id_user: 0,
    lama_sewa: 0,
    total_biaya: 0,
  };

  const apiURL = "https://cek-kosmu-server.herokuapp.com//listkosan";

  onMount(async () => {
    const res = await fetch(apiURL)
      .then((r) => r.json())
      .then((data) => {
        kosan = data;
      });
  });

  class Alert extends myAlert {
    // Properti
    private toast = Swal.mixin({
      toast: false,
      position: "center",
      showConfirmButton: true,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    public tipe: string;

    // Konstruktor
    constructor(teks: string, tipe: string) {
      super(teks, tipe);
      this.tipe = tipe;
    }
    // method untuk menampilkan toast
    public show() {
      this.toast.fire({
        icon: this.tipe != "success" ? "error" : "success",
        title: this.teks,
      });
    }
  }

  class User extends Users {
    // Properti
    private id_user: number;
    // konstruktor
    constructor(id_user: number) {
      super();
      this.id_user = id_user;
    }
    // setter
    set id_User(id: number) {
      this.id_user = id;
    }
    // getter
    get id_User() {
      return this.id_user;
    }
    // methods....
    selectKosan(index: number) {
      try {
        selected_kosan = kosan[index];
        console.log(selected_kosan);
      } catch (error) {
        alert(error);
      }
    }

    pesanKamarKos(id_kosan: number, lamasewa: number, n_kamar: number) {
      try {
        // cek apakah user telah login
        if (!localStorage.getItem("nama_user")) {
          alert("Silahkan signin terlebih dahulu!");
        } else {
          if(lamasewa == null || lamasewa == 0 || lamasewa == undefined){
            let alr = new Alert('Mohon masukkan lama sewa!', 'error');
            alr.show();
          }else{
              // post data (method, header, dan request body ke server api)
              fetch("https://cek-kosmu-server.herokuapp.com//users/buatpesanan", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: `id_user=${this.id_user}&id_kos=${id_kosan}&lama_sewa=${lamasewa}&nominal=${sewa_kos.total_biaya}`,
              })
              // handle data respon dari server
              .then((res) => {
                let alrt = new Alert(
                  "Berhasil melakukan Pemesanan!",
                  "success"
                );
                alrt.show();
                setTimeout(function(){
                  window.open("http://localhost:5000/user/dasbor", "_self");
                }, 4000);
              })
              // catch error
              .catch((err) => {
                let alrt1 = new Alert(err, "error");
                alrt1.showAlert();
              });
          }
        }
      } catch (error) {
        alert(error);
      }
    }
  }

  function sewa(id_kosan: number, id_user: number) {
    try {
      // cek apakah user telah login
      if (!localStorage.getItem("nama_user")) {
        alert("Silahkan signin terlebih dahulu!");
      } else {
        // instansiasi dari class User
        let usr = new User(parseInt(localStorage.getItem("id_user")));
        // memesan kamar kos
        usr.pesanKamarKos(id_kosan, sewa_kos.lama_sewa, 1);
      }
      // catch error
    } catch (error) {
      let alrt1 = new myAlert(error, "danger");
      alrt1.showAlert();
    }
  }

  // instansiasi objek
  let Usr = new User(parseInt(localStorage.getItem("id_user")));
</script>

<style>
  .h1 {
    color: #725232;
  }
</style>

<div class="mt-5 text-center">
  <h1 class="h1 pt-3">List Tempat Kos</h1>
  <div class="row row-cols-1 row-cols-md-2">
    {#if kosan}
      {#each kosan as hasil, counter}
        <div
          class="card mb-3 ml-3"
          style="max-width: 540px;"
          data-no={counter}
          data-toggle="modal"
          data-target="#InfoModal"
          on:click={() => Usr.selectKosan(counter)}>
          <div class="row no-gutters">
            <div class="col-md-4">
              <img
                src="https://cek-kosmu-server.herokuapp.com//upload/kosan/image-1608049910729.png"
                class="card-img"
                alt="..." />
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title text-left " style="margin-left: 13px;">
                  {hasil.nama_kos}
                </h5>
                <table class="table table-borderless text-left">
                  <tr>
                    <td>Total Kamar</td>
                    <td>:</td>
                    <td>{hasil.jumlah_kamar}</td>
                  </tr>
                  <tr>
                    <td>Luas Kamar</td>
                    <td>:</td>
                    <td>{hasil.luas_kamar} m&#178</td>
                  </tr>
                  <tr>
                    <td>Alamat Kos</td>
                    <td>:</td>
                    <td>{hasil.alamat_kos}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>

<!-- signin modal -->
<div class="modal fade" tabindex="-1" role="dialog" id="InfoModal">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <div class="row">
          <div class="col-3 p-2">
            <img
              src="https://cek-kosmu-server.herokuapp.com//upload/kosan/image-1608049910729.png"
              class="border"
              width="125"
              height="125"
              alt="" />
          </div>
          <div class="col-9 text-left">
            Nama Kosan :
            {selected_kosan.nama_kos}<br />
            Total Kamar :
            {selected_kosan.jumlah_kamar}
            kamar<br />
            Alamat Kos :
            {selected_kosan.alamat_kos}<br />
            Fasilitas :
            {selected_kosan.fasilitas}<br /><br />
            Harga Sewa : Rp
            {selected_kosan.harga_sewa}
            ; per bulan<br /><br />
            Lama Sewa (dalam bulan) :
            <input
              type="number"
              bind:value={sewa_kos.lama_sewa}
              on:change={() => (sewa_kos.total_biaya = selected_kosan.harga_sewa * sewa_kos.lama_sewa)}
              title="tekan enter setelah memasukkan lama sewa"
              required /><br />
            Total Biaya Sewa (Rp) :
            <input type="number" bind:value={sewa_kos.total_biaya} disabled />
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-primary"
          on:click={() => sewa(selected_kosan.id_kos, parseInt(localStorage.getItem('id_user')))}>Sewa
          Kamar</button>
      </div>
    </div>
  </div>
</div>
