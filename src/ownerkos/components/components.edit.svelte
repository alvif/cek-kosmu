<script lang="ts">
  import axios from "axios";

  let result;
  let data_kosan = [];
  let current_kosan = {
    id_kos: 0,
    id_pemilik: 0,
    nama_kos: '',
    alamat_kos: '',
    luas_kamar: 0,
    jarak_kos: 0,
    jumlah_kamar: 0,
    kamar_dipesan: 0, 
    kamar_dihuni: 0, 
    fasilitas: '',
    harga_sewa: 0
  };

  function getKosan() {
    try {
      axios
        .get("https://cek-kosmu-server.herokuapp.com//owners/listkosan", {
          headers: {
            Authorization: localStorage.getItem("owner"),
            owner_id: localStorage.getItem("id_owner"),
          },
        })
        .then(function (res) {
          // respon
          result = res.data;
          if (result.message == "Data ditemukan!") {
            data_kosan = result.data;
          } else {
            alert(result.message);
          }
        })
        .catch(function (err) {
          // error handling
          console.log(err);
        });
    } catch (error) {
      alert(error);
    }
  }

  function currentKosan(id_kosan: number){
    try {
      current_kosan.id_kos = data_kosan[id_kosan].id_kos;
      current_kosan.id_pemilik = data_kosan[id_kosan].id_pemilik;
      current_kosan.nama_kos = data_kosan[id_kosan].nama_kos;
      current_kosan.alamat_kos = data_kosan[id_kosan].alamat_kos;
      current_kosan.luas_kamar = data_kosan[id_kosan].luas_kamar;
      current_kosan.jarak_kos = data_kosan[id_kosan].jarak_kos;
      current_kosan.jumlah_kamar = data_kosan[id_kosan].jumlah_kamar;
      current_kosan.kamar_dipesan = data_kosan[id_kosan].kamar_dipesan;
      current_kosan.kamar_dihuni = data_kosan[id_kosan].kamar_dihuni;
      current_kosan.fasilitas = data_kosan[id_kosan].fasilitas;
      current_kosan.harga_sewa = data_kosan[id_kosan].harga_sewa;
      console.log(current_kosan);
    } catch (error) {
      alert(error);
    }
  }

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

  tr {
    line-height: 50px;
  }

  .kosan {
    padding-top: 10px;
    padding-left: 10px;
    padding-bottom: 2px;
    margin-bottom: 5px;
  }

  .kosan:hover {
    border-radius: 5px;
    background-color: #f7f7f7;
  }

  .kosan:active {
    background-color: #f2f2f2;
  }

  .card-header{
    background-color: #FFD38D;
  }
</style>

<div class="card">
  <div class="card-header text-left">
    Tempat Kos
    <span class="badge badge-warning" id="counter" />
  </div>
  <div class="card-body">
    <div class="d-flex align-items-center">
      <div class="col-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title text-left">List</h5>
            <div class="list text-left" id="list">
              {#if data_kosan.length == 1}
                <div class="kosan" on:click={()=> currentKosan(0)}>
                  <p>
                    <strong>Nama Kosan: {data_kosan[0].nama_kos}</strong><br />
                    Alamat :
                    {data_kosan[0].alamat_kos}
                  </p>
                </div>
              {:else if data_kosan.length == 0}
                <div class="kosan"><span>Kosong...</span></div>
              {:else}
                {#each data_kosan as data, i}
                  <div class="kosan" id={(i + 1).toString()} on:click={()=> currentKosan(i)}>
                    <p>
                      <strong>Nama Kosan: {data.nama_kos}</strong><br />
                      Alamat :
                      {data.alamat_kos}
                    </p>
                  </div>
                {/each}
              {/if}
            </div>
          </div>
        </div>
      </div>
      <div class="col-5">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title text-left">KETERANGAN</h5>
            <div class="list" id="ket">
              <table class='text-left'>
                <tr style="line-height: 25px;">
                  <td>Nama Kosan</td><td>:</td><td><input type="text" bind:value={current_kosan.nama_kos}></td>
                </tr>
                <tr style="line-height: 25px;">
                  <td>Alamat Kosan</td><td>:</td><td><input type="text" bind:value={current_kosan.alamat_kos}></td>
                </tr>
                <tr style="line-height: 25px;">
                  <td>Luas Kamar ( m&#178 )</td><td>:</td><td><input type="number" min=0 bind:value={current_kosan.luas_kamar}></td>
                </tr>
                <tr style="line-height: 25px;">
                  <td>Jumlah Kamar</td><td>:</td><td><input type="number" min=0 bind:value={current_kosan.jumlah_kamar}></td>
                </tr>
                <tr style="line-height: 25px;">
                  <td>Fasilitas Kamar</td><td>:</td><td><input type="text" bind:value={current_kosan.fasilitas}></td>
                </tr>
                <tr style="line-height: 25px;">
                  <td>Harga Sewa</td><td>:</td><td><input type="number" min=0 bind:value={current_kosan.harga_sewa}></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="d-flex flex-column-reverse">
          <button class="btn btn-success m-2" on:click={() => alert('Coming Soon :)')}>Simpan Perubahan</button>
        </div>
      </div>
    </div>
  </div>
</div>
