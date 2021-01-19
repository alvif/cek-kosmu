<script lang="ts">
  import axios from "axios";
  import { Pengguna, Owner } from "../User";

  let fas = [];
  let T = "";
  let TL = "";

  let data_owner = {
    nama_owner: "",
    alamat_owner: "",
    TTL: "",
    jk: "",
    no_telpon: "",
    email: "",
    username: "",
    password: "",
  };

  let data_kosan = {
    id_pemilik: 0,
    nama_kos: "",
    alamat_kos: "",
    luas_kos: "",
    jarak_kos: "",
    jumlah_kamar: 0,
    fasilitas: [],
    harga_sewa: "",
    status_kosan: "after register",
    img: "",
  };
 
  class PemilikKos extends Owner{
    signup(){
      try {
        axios({
          method: 'post',
          url: 'https://cek-kosmu-server.herokuapp.com/owners/signup',
          data: {
            nama: data_owner.nama_owner,
            alamat: data_owner.alamat_owner,
            ttl: T + ", " + TL,
            jk : data_owner.jk,
            no_telpon: data_owner.no_telpon,
            email: data_owner.email,
            username: data_owner.username,
            password: data_owner.password,
            createdAt: Date(),
            updatedAt: Date()
          }
        });
        alert("Berhasil signup!");
        window.open("http://localhost:5000/owner/login", "_self");
      } catch (error) {
        alert(error);
      }
    }
  }

  function daftar(){
    let Pemilik: Pengguna = new PemilikKos();
    try {
      Pemilik.signup();
    } catch (error) {
      console.log(error);
    }
  }

</script>

<style>
  #judul {
    margin-top: 60px;
  }
  .c {
    border-radius: 5px;
    border-color: white;
  }
</style>

<h1 class="h1 text-center" id="judul">FORMULIR PENDAFTARAN</h1>
<div class="card mb-2 card-bg">
  <div class="card-body">
    <div class="row text-center">
      <div class="col-4">
        <div class="form-group text-center">
          <label for="txtnamaowner">NAMA PEMILIK KOS</label><br />
          <input
            type="text"
            class="form-control"
            id="txtnamaowner"
            bind:value={data_owner.nama_owner}
            required />
        </div>
      </div>
      <div class="col-4">
        <div class="form-group text-center">
          <label for="txtTTL">TEMPAT/TANGGAL LAHIR</label><br />
          <input
            type="text"
            class="form-control mb-1"
            id="txtTTL"
            bind:value={T}
            placeholder="Kota Lahir"
            required />
          <input
            type="date"
            class="form-control"
            placeholder="Tanggal Lahir"
            bind:value={TL}
            required />
        </div>
      </div>

      <div class="col-4">
        <div class="form-group text-center">
          <label for="txtJK">JENIS KELAMIN</label><br />
          <select class="form-control" id="txtJK" bind:value={data_owner.jk}>
            <option value="">Pilih..</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <div class="form-group text-center">
          <label for="txtemail">EMAIL</label><br />
          <input
            type="email"
            class="form-control"
            id="txtemail"
            bind:value={data_owner.email}
            required />
        </div>
      </div>
      <div class="col-4">
        <div class="form-group text-center">
          <label for="txtalamat">ALAMAT PEMILIK</label><br />
          <textarea
            class="form-control"
            cols="30"
            rows="5"
            bind:value={data_owner.alamat_owner}
            required />
        </div>
      </div>
      <div class="col-4">
        <div class="form-group text-center">
          <label for="txttelpon">NO TELEPON</label><br />
          <input
            type="text"
            class="form-control"
            id="txttelpon"
            bind:value={data_owner.no_telpon}
            required />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <div class="form-group text-center">
          <label for="">USERNAME</label>
          <input type="text" class="form-control" bind:value={data_owner.username}/>
        </div>
      </div>
      <div class="col-4">
        <div class="form-group text-center">
          <label for="">PASSWORD</label>
          <input type="text" class="form-control" bind:value={data_owner.password}/>
        </div>
      </div>
      <div class="col-4">
        <!-- <form action="">
          <input type="file" name="file" id="file">
          <button on:click={up}>UP</button>
        </form> -->
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <div class="form-group text-center">
          <label for="">NAMA KOS</label>
          <input type="text" class="form-control" />
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
            type="text"
            class="form-control"
            id="txtluaskamar"
            bind:value={data_kosan.luas_kos}
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
            type="text"
            class="form-control"
            id="txtbiaya"
            bind:value={data_kosan.harga_sewa}
            required />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-4 align-items-center">
        <!-- <label for="">Foto Kosan</label>
        <form>
          <div class="input-group c">
            <div class="custom-file">
              <input type="file" id="file" />
              <button class="btn btn-primary" on:click={up}>Upload</button>
            </div>
          </div>
        </form> -->
      </div>
      <div class="col-4">
        <div class="text-center mt-4">
          <button class="btn btn-success m-2" on:click={daftar}>SUBMIT</button>
        </div>
      </div>
    </div>
    <div class="text-right">
      Sudah punya akun?
      <a href="http://localhost:5000/owner/login">Login disini</a>
    </div>
  </div>
</div>
