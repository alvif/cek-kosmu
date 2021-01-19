<script lang="ts">
  import axios from "axios";
  import { Admin } from "../../User";

  let data_pemesanan = [];
  let data_kosan = [];
  let data_owner = [];
  let data_user = [];

  let i_u: number = 0;
  let i_k: number = 0;
  let i_o: number = 0;
  let i_p: number = 0;

  let id_psn: number = 0;

  class Adm extends Admin {
    constructor(id: number) {
      super(id);
    }

    konfirmasiPemesanan(id_pemesanan: number) {
      try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', localStorage.getItem('owner'));
        headers.append('id_pemesanan', id_pemesanan.toString());

        const body = `ketersediaan=tersedia`;

        const init = {
          method: 'POST',
          headers,
          body
        };

        fetch('https://cek-kosmu-server.herokuapp.com//owners/confirm-pesanan', init)
        .then((response) => {
          if(response.status == 200){
            alert('Berhasil konfirmasi ketersediaan kamar!');
          }
        })
        .catch((e) => {
          alert(e);
        });
      } catch (error) {
        alert(error);
      }
    }

    getUnconfirmedPesanan() {
      try {
        axios
          .get("https://cek-kosmu-server.herokuapp.com//owners/unconfirmed-pesanan", {
            headers: {
              Authorization: localStorage.getItem("owner"),
              status_pesanan: "unconfirmed",
            },
          })
          .then((res) => {
            // memasukkan response data
            let result = res.data;
            // memilah data sesuai kelompok
            data_pemesanan = result.data;
            data_kosan = result.data_kosan;
            data_owner = result.data_owner;
            data_user = result.data_user;
            console.log(result);
          });
      } catch (error) {
        alert(error);
      }
    }
  }

  function getListUnconfirmed() {
    try {
      let adm = new Adm(parseInt(localStorage.getItem("id_owner")));
      adm.getUnconfirmedPesanan();
    } catch (error) {
      alert(error);
    }
  }

  function konfirmasiPemesanan(){
    try {
      let adm = new Adm(parseInt(localStorage.getItem("id_owner")));
      adm.konfirmasiPemesanan(i_p);
      adm.getUnconfirmedPesanan();
    } catch (error) {
      alert(error);
    }
  }

  function getKeterangan(id_pesanan: number,id_user: number,id_kosan: number) {
    let keterangan: string = ``;
    id_psn = id_pesanan;
    // search index
    for (let i = 0; i < data_kosan.length; i++) {
      if (data_kosan[i].id_kos == id_kosan) {
        i_k = i;
        for (let j = 0; j < data_user.length; j++) {
          if (data_user[j].id_user == id_user) {
            i_u = j;
            for (let k = 0; k < data_owner.length; k++) {
              if (data_owner[k].id_owner == data_kosan[i_k].id_pemilik) {
                i_o = k;
                for (let l = 1; l < data_pemesanan.length; l++) {
                  if (data_pemesanan[l].id_pesanan == id_pesanan) {
                    i_p = l;
                  }
                }
              }
            }
          }
        }
      }
    }

    keterangan = `
    <strong>Info Pemesanan</strong>
    <table class="text-left">
      <tr style="line-height: 25px;">
        <td>Id Pemesanan</td><td>:</td><td>${data_pemesanan[i_p].id_pesanan}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Lama Sewa</td><td>:</td><td>${data_pemesanan[i_p].lama_tinggal} bulan</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Kamar dipesan</td><td>:</td><td>${data_pemesanan[i_p].n_kamar} unit</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Ketersediaan Kamar</td><td>:</td><td>${data_pemesanan[i_p].ketersediaan}</td>
      </tr>
    </table>
    <br/>
    <strong>Data Pemesan</strong>
    <table class='text-left'>
      <tr style="line-height: 25px;">
        <td>Nama User</td><td>:</td><td>${data_user[i_u].nama_user}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Alamat User</td><td>:</td><td>${data_user[i_u].alamat_user}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>No. Telepon</td><td>:</td><td>${data_user[i_u].telpon_user}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Email</td><td>:</td><td>${data_user[i_u].email_user}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>TTL</td><td>:</td><td>${data_user[i_u].tgllahir}</td>
      </tr>
    </table>
    <br/>
    <strong>Data Tempat Kos</strong>
    <table class='text-left'>
      <tr style="line-height: 25px;">
        <td>Nama Kosan</td><td>:</td><td>${data_kosan[i_k].nama_kos}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Alamat Kosan</td><td>:</td><td>${data_kosan[i_k].alamat_kos}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Luas Kamar</td><td>:</td><td>${data_kosan[i_k].luas_kamar}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Jumlah Kamar</td><td>:</td><td>${data_kosan[i_k].jumlah_kamar}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Jumlah Kamar</td><td>:</td><td>${data_kosan[i_k].fasilitas}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Kamar dipesan</td><td>:</td><td>${data_kosan[i_k].kamar_dipesan}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Kamar dihuni</td><td>:</td><td>${data_kosan[i_k].kamar_dihuni}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Harga Sewa</td><td>:</td><td>${data_kosan[i_k].harga_sewa}</td>
      </tr>
    </table>
    <br/>
    `;

    document.getElementById("ket").innerHTML = keterangan;
  }

  getListUnconfirmed();
</script>

<style>
  .list {
    height: 250px;
    overflow-y: scroll;
  }

  .keterangan {
    height: 250px;
  }

  #btnkonfirm {
    margin-top: 250px;
  }

  .card-header {
    background-color: #ffd38d;
  }
</style>

<div class="card">
  <div class="card-header text-left">
    Perlu Konfirmasi
    <span class="badge badge-primary">{data_pemesanan.length}</span>
  </div>
  <div class="card-body">
    <div class="d-flex align-items-top">
      <div class="col-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title text-left">List</h5>
            <div class="list text-left" id="list">
              {#each data_pemesanan as data, i}
                <div
                  class="unconfirmed-pesanan"
                  id={data.id_pesanan}
                  on:click={() => {
                    getKeterangan(data.id_pesanan, data.id_user, data.id_kos);
                  }}>
                  <strong>ID Pesanan: {data.id_pesanan}</strong>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
      <div class="col-5">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title text-left">Keterangan</h5>
            <div class="list" id="ket" />
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="d-flex flex-column-reverse">
          <button
            class="btn btn-success p-2"
            id="btnkonfirm" on:click={konfirmasiPemesanan}>KONFIRMASI</button>
        </div>
      </div>
    </div>
  </div>
</div>
