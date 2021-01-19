<script lang="ts">
  import axios from 'axios';
  import { Owner } from '../../User'

  let fas = []

  let data_kosan = {
    id_pemilik: localStorage.getItem('id_owner'),
    nama_kos: "",
    alamat_kos: "",
    luas_kamar: 0,
    jarak_kos: 0,
    jumlah_kamar: 0,
    fasilitas: fas,
    harga_sewa: 0,
    status_kosan: "after register",
    img: ""
  };

  // alert(localStorage.getItem('owner'));
  // alert(localStorage.getItem('id_owner'));

  class PemilikKos extends Owner{
    tambahKos(){
      try {
        if(!data_kosan.nama_kos){
          alert('Mohon isi data dengan lengkap!');
          return;
        }else{
          axios({
          method: 'post',
          url: 'https://cek-kosmu-server.herokuapp.com/owners/tambah-kos', 
          headers : {
            'authorization' : localStorage.getItem('owner')
          },
          data : {
            id_pemilik: localStorage.getItem('id_owner'),
            nama_kos: data_kosan.nama_kos,
            alamat_kos: data_kosan.alamat_kos,
            luas_kamar: data_kosan.luas_kamar,
            jarak_kos:data_kosan.jarak_kos,
            jumlah_kamar: data_kosan.jumlah_kamar,
            fasilitas: data_kosan.fasilitas, 
            harga_sewa: data_kosan.harga_sewa,
            img: '',
          }
        })
        .then(function (response){
          let respon = response.data
          alert(respon.message);
        });
        }
      } catch (error) {
        alert(error);
      }
    }
  }

  function submit(){
    try {
      axios({
          method: 'post',
          url: 'https://cek-kosmu-server.herokuapp.com/owners/tambah-kosan', 
          headers : {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization' : localStorage.getItem('owner').toString()
          },
          data : {
            id_pemilik: localStorage.getItem('id_owner'),
            nama_kos: data_kosan.nama_kos,
            alamat_kos: data_kosan.alamat_kos,
            luas_kamar: data_kosan.luas_kamar,
            jarak_kos: data_kosan.jarak_kos,
            jumlah_kamar: data_kosan.jumlah_kamar,
            fasilitas: data_kosan.fasilitas, 
            harga_sewa: data_kosan.harga_sewa,
            img: '',
          }
        })
        .then(function (response){
          let respon = response.data
          alert(respon.message);
        })
        .catch(function (error) {
          alert(error.message);
        })

        // axios.post('https://cek-kosmu-server.herokuapp.com/owners/tambah-kosan', {
        //   id_pemilik: localStorage.getItem('id_owner'),
        //   nama_kos: data_kosan.nama_kos,
        //   alamat_kos: data_kosan.alamat_kos,
        //   luas_kamar: data_kosan.luas_kamar,
        //   jarak_kos:data_kosan.jarak_kos,
        //   jumlah_kamar: data_kosan.jumlah_kamar,
        //   kamar_dipesan: 0,
        //   kamar_dihuni: 0,
        //   fasilitas: data_kosan.fasilitas, 
        //   harga_sewa: data_kosan.harga_sewa,
        //   status_kosan: "after register",
        //   img: ''
        // }, {
        //   headers : {
        //     'Content-Type': 'application/x-www-form-urlencoded',
        //     'Authorization' : localStorage.getItem('owner')
        //   }
        // })
        // .then(function (response) {
        //   let respon = response.data;
        //   alert(respon.message);
        // })
        // .catch(function (error) {
        //   alert(error.message);
        // })

        // let txtpass:string = '';
        // txtpass = encryptPW(signup_obj.password);
        // const response = axios.post('https://cek-kosmu-server.herokuapp.com/owners/tambah-kosan', {
        //   id_pemilik: localStorage.getItem('id_owner'),
        //   nama_kos: data_kosan.nama_kos,
        //   alamat_kos: data_kosan.alamat_kos,
        //   luas_kamar: data_kosan.luas_kamar,
        //   jarak_kos:data_kosan.jarak_kos,
        //   jumlah_kamar: data_kosan.jumlah_kamar,
        //   kamar_dipesan: 0,
        //   kamar_dihuni: 0,
        //   fasilitas: data_kosan.fasilitas, 
        //   harga_sewa: data_kosan.harga_sewa,
        //   status_kosan: "after register",
        //   img: ''
        // })
        // .then(data => {
        //   alert(data.statusText);
        // })
        // .catch(err => {
        //   alert(err);
        // })
    
        // fetch('https://cek-kosmu-server.herokuapp.com/owners/tambah-kosan', {
        //   method: 'POST', 
        //   headers: {
        //     'Content-type' : 'application/q-www-form-urlencoded', 
        //     'Authorization' :'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9vd25lciI6MSwibmFtYV9vd25lciI6IkFsdmlmIFNhbmRhbmEgTWFoYXJkaWthIiwiYWxhbWF0X293bmVyIjoiUm9nb2phbXBpIiwiVFRMIjoiQldJLCAyNCBBZ3VzdHVzIDIwMDAiLCJqayI6IkwiLCJub190ZWxwb24iOiIwODEzNDU2Nzg5MDAiLCJlbWFpbCI6ImFzbTI0MDgwMEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoidGVzdDEyMzQ1IiwiY3JlYXRlZEF0IjoiMjAyMC0xMi0yNFQxODo1NDoxMC4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMC0xMi0yNFQxODo1NDoxMC4wMDBaIiwiaWF0IjoxNjEwNTI4NTcyfQ._LGo7oMliFT76-WpCv0Ys2CY5u8897ugTnrqXeKIsvM'
        //   },
        //   body : ""
        // })
    } catch (error) {
      alert(error)
    }
  }

  function submit1(){
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9vd25lciI6MSwibmFtYV9vd25lciI6IkFsdmlmIFNhbmRhbmEgTWFoYXJkaWthIiwiYWxhbWF0X293bmVyIjoiUm9nb2phbXBpIiwiVFRMIjoiQldJLCAyNCBBZ3VzdHVzIDIwMDAiLCJqayI6IkwiLCJub190ZWxwb24iOiIwODEzNDU2Nzg5MDAiLCJlbWFpbCI6ImFzbTI0MDgwMEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoidGVzdDEyMzQ1IiwiY3JlYXRlZEF0IjoiMjAyMC0xMi0yNFQxODo1NDoxMC4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMC0xMi0yNFQxODo1NDoxMC4wMDBaIiwiaWF0IjoxNjEwNTI4NTcyfQ._LGo7oMliFT76-WpCv0Ys2CY5u8897ugTnrqXeKIsvM');

    const body = `id_pemilik=${localStorage.getItem('id_owner')}&nama_kos=${data_kosan.nama_kos}&alamat_kos=${data_kosan.alamat_kos}&luas_kamar=${data_kosan.luas_kamar}&jarak_kos=${data_kosan.jarak_kos}&fasilitas=${data_kosan.fasilitas}&harga_sewa=${data_kosan.harga_sewa}&jumlah_kamar=${data_kosan.jumlah_kamar}`;

    const init = {
      method: 'POST',
      headers,
      body
    };

    fetch('https://cek-kosmu-server.herokuapp.com/owners/tambah-kosan', init)
    .then((response) => {
      let res = response.statusText;
      alert(res)
      return response.json(); // or .text() or .blob() ...
    })
    .catch((e) => {
      // error in e.message
      alert(e);
    });
  }
</script>

<style>
    .card-header{
    background-color: #FFD38D;
  }
</style>

<div class="card" disabled>
  <div class="card-header text-left">
    Registrasi Kosan Baru
  </div>
  <div class="card-body">
    <div class="form-reg">
      <div class="row">
        <div class="col-4">
          <div class="form-group text-center">
            <label for="">NAMA KOS</label>
            <input type="text" class="form-control" bind:value={data_kosan.nama_kos}/>
          </div>
        </div>
        <div class="col-4">
          <div class="form-group text-center">
            <label for="txtalamat">ALAMAT KOS</label><br />
            <textarea
              class="form-control"
              cols="30"
              rows="5"
              bind:value={data_kosan.alamat_kos}
              required />
          </div>
        </div>
        <div class="col-4">
          <div class="form-group text-center">
            <label for="txtluaskamar">LUAS KAMAR (dalam m&#178)</label><br />
            <input
              type="number"
              class="form-control"
              id="txtluaskamar"
              bind:value={data_kosan.luas_kamar}
              required />
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-4">
          <div class="form-group text-center">
            <label for="txtjumlahkamar">BANYAK KAMAR</label><br />
            <input
              type="number"
              class="form-control"
              id="txtjumlahkamar"
              bind:value={data_kosan.jumlah_kamar}
              min="1"
              required />
          </div>
        </div>
        <div class="col-4">
          <div class="form-group text-center">
            <label for="txtfasilitas">FASILITAS</label><br />
            <!-- <input type="text" class="form-control" id="txtfasilitas" required /> -->
            <table id="fasilitas-container">
              <tr>
                <td>
                  <label><input
                      type="checkbox"
                      bind:group={fas}
                      id="fas0"
                      value="Tempat tidur" />
                    Tempat tidur</label>
                </td>
                <td>
                  <label><input
                      type="checkbox"
                      bind:group={fas}
                      id="fas5"
                      value="dapur" />
                    Dapur</label>
                </td>
              </tr>
              <tr>
                <td>
                  <label><input
                      type="checkbox"
                      bind:group={fas}
                      id="fas1"
                      value="Meja" />
                    Meja</label>
                </td>
                <td>
                  <label><input
                      type="checkbox"
                      bind:group={fas}
                      id="fas6"
                      value="Wi-Fi" />
                    Wi-Fi</label>
                </td>
              </tr>
              <tr>
                <td>
                  <label><input
                      type="checkbox"
                      bind:group={fas}
                      id="fas2"
                      value="Almari" />
                    Almari</label>
                </td>
                <td>
                  <label><input
                      type="checkbox"
                      bind:group={fas}
                      id="fas7"
                      value="AC" />
                    AC</label>
                </td>
              </tr>
              <tr>
                <td>
                  <label><input
                      type="checkbox"
                      bind:group={fas}
                      id="fas3"
                      value="Kursi & meja belajar" />
                    Kursi & meja belajar
                  </label>
                </td>
                <td>
                  <label><input
                      type="checkbox"
                      bind:group={fas}
                      id="fas8"
                      value="TV" />
                    TV</label>
                </td>
              </tr>
              <tr>
                <td>
                  <label><input
                      type="checkbox"
                      bind:group={fas}
                      id="fas4"
                      value="Kamar mandi dalam" />
                    Kamar mandi dalam
                  </label>
                </td>
                <td>
                  <label><input
                      type="checkbox"
                      bind:group={fas}
                      id="fas9"
                      value="Laundry" />
                    Laundry</label>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="col-4">
          <div class="form-group text-center">
            <label for="txtbiaya">BIAYA PERBULAN</label><br />
            <input
              type="number"
              class="form-control"
              id="txtbiaya"
              bind:value={data_kosan.harga_sewa}
              required />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-4"></div>
        <div class="col-4">
          <div class="text-center mt-4">
            <button class="btn btn-success m-2" on:click={() => alert('Coming Soon :)')}>SUBMIT</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>