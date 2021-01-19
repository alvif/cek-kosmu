<script lang="ts">
  import axios from "axios";
  import { Admin } from "../User"

  let result;
  let data_kosan = [];
  let data_owner = [];

  let i_list: number = 0;

  class Adm extends Admin {
    constructor(id: number) {
      super(id);
    }

    konfirmasiPemesanan(id_pemesanan: number, id_kos: number, opsi: string){

    }

    konfirmasiPendaftaran(id_kos: number, opsi: string){
      try {
        if(opsi === 'terima'){
          axios.post('https://cek-kosmu-server.herokuapp.com//admin/konfirmasi-pendaftaran', {
            'id_kos': data_kosan[i_list].id_kos,
            'status_kosan': 'verified'
          }, {
            headers: {
              Authorization: localStorage.getItem("admin"),
              'Content-Type': 'application/x-www-form-urlencoded',
              'id_kos': data_kosan[i_list].id_kos,
              'status_kosan': 'verified'
            }
          })
          .then((res) => {
            let respon = res.data;
            alert(respon.message);
            document.getElementById('ket').innerHTML = ''
            getKosan();
          })
          .catch((err) => {
            alert(err);
          });
        }else if(opsi === 'tolak'){
          axios.post('https://cek-kosmu-server.herokuapp.com//admin/konfirmasi-pendaftaran', {
            'id_kos': data_kosan[i_list].id_kos,
            'status_kosan': 'not verified'
          }, {
            headers: {
              Authorization: localStorage.getItem("admin"),
              'Content-Type': 'application/x-www-form-urlencoded',
              'id_kos': data_kosan[i_list].id_kos,
              'status_kosan': 'not verified'
            }
          })
          .then((res) => {
            let respon = res.data;
            alert(respon.message);
            document.getElementById('ket').innerHTML = ''
            getKosan();
          })
          .catch((err) => {
            alert(err);
          });
        }else{
          alert('Error opsi!');
        }
      } catch (error) {
        alert(error);
      }
    }
  }

  function getKosan() {
    try {
      axios
        .get("https://cek-kosmu-server.herokuapp.com//admin/unverified-kosan", {
          headers: {
            Authorization: localStorage.getItem("admin"),
            status_kosan: "after register",
          },
        })
        .then(function (response) {
          // respon
          result = response.data;
          if (result.message == "Data Ditemukan!") {
            data_kosan = result.data;
            data_owner = result.data_owner;
            console.log(result);
          } else {
            alert(result.message);
          }
        })
        .then(function (error) {
          // handle error
          console.log(error);
        });
    } catch (error) {
      alert(error);
    }
  }

  function getKeterangan(id_kosan: number, id_owner: number) {
    let keterangan: string = ``;
    let id_k: number = 0;
    let id_o: number = 0;
    // search index
    for (let i = 0; i < data_kosan.length; i++) {
      if (data_kosan[i].id_kos == id_kosan) {
        id_k = i;
      }
    }
    for (let j = 0; j < data_owner.length; j++) {
      if (data_owner[j].id_owner == id_owner) {
        id_o = j;
      }
    }

    keterangan = `
    <table class='text-left'>
      <tr style="line-height: 25px;">
        <td>Nama Kosan</td><td>:</td><td>${data_kosan[id_k].nama_kos}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Alamat Kosan</td><td>:</td><td>${data_kosan[id_k].alamat_kos}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Luas Kamar</td><td>:</td><td>${data_kosan[id_k].luas_kamar}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Jumlah Kamar</td><td>:</td><td>${data_kosan[id_k].jumlah_kamar}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Jumlah Kamar</td><td>:</td><td>${data_kosan[id_k].fasilitas}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Harga Sewa</td><td>:</td><td>${data_kosan[id_k].harga_sewa}</td>
      </tr>
    </table>
    <br/>
    <table class='text-left'>
      <tr style="line-height: 25px;">
        <td>Nama Owner</td><td>:</td><td>${data_owner[id_o].nama_owner}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Alamat Owner</td><td>:</td><td>${data_owner[id_o].alamat_owner}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>No. Telepon</td><td>:</td><td>${data_owner[id_o].no_telpon}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Email</td><td>:</td><td>${data_owner[id_o].email}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>TTL</td><td>:</td><td>${data_owner[id_o].TTL}</td>
      </tr>
    </table>
    `;
    document.getElementById("ket").innerHTML = keterangan;
  }

  let adm: Adm = new Adm(parseInt(localStorage.getItem('id_admin')));
  getKosan();

</script>

<style>
  .list {
    height: 250px;
    overflow-y: scroll;
    overflow-x: scroll;
  }

  .keterangan {
    height: 250px;
  }

  tr{
    line-height: 50px;
  }
  
  .card-header{
    background-color: #FFD38D;
  }
</style>

<div class="card">
  <div class="card-header text-left">
    Perlu Verifikasi
    <span class="badge badge-warning" id="counter">{data_kosan.length}</span>
  </div>
  <div class="card-body">
    <div class="d-flex align-items-center">
      <div class="col-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title text-left">List</h5>
            <div class="list text-left" id="list">
              {#each data_kosan as data, i}
                <div
                  class="kosan-perlu-verifikasi"
                  id={(i + 1).toString()}
                  on:click={() => getKeterangan(data.id_kos, data.id_pemilik)}>
                  {#each data_owner as datao}
                    {#if data.id_pemilik == datao.id_owner}
                      <p>
                        <strong>Username: {datao.nama_owner}</strong><br />
                        Nama Kosan :{data.nama_kos}
                      </p>
                    {/if}
                  {/each}
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
      <div class="col-5">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title text-left">KETERANGAN</h5>
            <div class="list" id="ket" />
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="d-flex flex-column-reverse">
          <button class="btn btn-danger m-2" on:click={() => adm.konfirmasiPendaftaran(i_list, 'tolak')}>Tolak</button>
          <button class="btn btn-success m-2" on:click={() => adm.konfirmasiPendaftaran(i_list, 'terima')}>Terima</button>
        </div>
      </div>
    </div>
  </div>
</div>
