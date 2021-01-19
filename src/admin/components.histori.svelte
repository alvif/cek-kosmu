<script lang="ts">
  import axios from 'axios';
  import { Admin } from "../User";

  let data_transaksi = [];

  let selected_i_tr = 0;

  class Adm extends Admin{
    constructor(id: number){
      super(id);
    }

    getUnconfirmedPembayaran(){
      try {
        axios.get('https://cek-kosmu-server.herokuapp.com/admin/unconfirmed-transaksi', {
          headers: {
            'Authorization' : localStorage.getItem('admin')
          }
        })
        .then((res) => {
          let respon = res.data;
          data_transaksi = respon.data;
        })
        .catch((err) =>{
          alert(err);
        })
      } catch (error) {
        alert(error);
      }
    }

    getKeterangan(id_transaksi:number){
      let keterangan: string = ``;
      // search index
      for(let i=0; i<data_transaksi.length; i++){
        if(data_transaksi[i].id_transaksi == id_transaksi){
          selected_i_tr = i;
        }
      }
      keterangan = `
      <strong>Info Pemesanan</strong>
      <table class="text-left">
        <tr style="line-height: 25px;">
          <td>Id transaksi</td><td>:</td><td>${data_transaksi[selected_i_tr].id_transaksi}</td>
        </tr>
        <tr style="line-height: 25px;">
          <td>Kode Transaksi</td><td>:</td><td>${data_transaksi[selected_i_tr].kode_transaksi} </td>
        </tr>
        <tr style="line-height: 25px;">
          <td>Tanggal Transaksi</td><td>:</td><td>${data_transaksi[selected_i_tr].tgl_transaksi} </td>
        </tr>
        <tr style="line-height: 25px;">
          <td>Id Penyewa</td><td>:</td><td>${data_transaksi[selected_i_tr].id_penyewa}</td>
        </tr>
        <tr style="line-height: 25px;">
          <td>Id Kosan</td><td>:</td><td>${data_transaksi[selected_i_tr].id_kosan}</td>
        </tr>
        <tr style="line-height: 25px;">
          <td>Kamar dipesan</td><td>:</td><td>${data_transaksi[selected_i_tr].n_kamar}</td>
        </tr>
        <tr style="line-height: 25px;">
          <td>Nominal</td><td>:</td><td>${data_transaksi[selected_i_tr].nominal}</td>
        </tr>
      </table>
      `;

      document.getElementById('ket').innerHTML = keterangan;
    }

    konfirmasiPembayaran(){
      try {
        if(selected_i_tr < 0){
          alert('Mohon Pilih Pembayaran!');
          return;
        }
        axios.post('https://cek-kosmu-server.herokuapp.com/admin/konfirmasi-transaksi',{},{
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', 
            'Authorization': localStorage.getItem('admin'),
            'id_transaksi': data_transaksi[selected_i_tr].id_transaksi
          }
        })
        .then((res) => {
          let respon = res.data;
          alert(respon.message);
          document.getElementById('ket').innerHTML = '';
          this.getUnconfirmedPembayaran();
        })
      } catch (error) {
        alert(error);
      }
    }

    konfirmasiPemesanan(){}
  }

  let adm: Adm = new Adm(parseInt(localStorage.getItem('id_admin')));
  
  adm.getUnconfirmedPembayaran();
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
    <span class="badge badge-success">0</span>
  </div>
  <div class="card-body">
    <div class="d-flex align-items-top">
      <div class="col-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title text-left">List</h5>
            <div class="list text-left" id='list'>
              {#each data_transaksi as data}
                <div class="unconfirmed-pesanan" on:click={() => adm.getKeterangan(data.id_transaksi)}>
                  <strong>Id Pembayaran: {data.id_transaksi}</strong>
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
            <div class="list" id='ket'>

            </div>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="d-flex flex-column-reverse">
          <button class="btn btn-success p-2" on:click={()=> adm.konfirmasiPembayaran()}>Konfirmasi</button>
        </div>
      </div>
    </div>
  </div>
</div>
