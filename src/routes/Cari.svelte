<script lang="ts">
    // impor kelas Tsukamoto
    import { Tsukamoto } from '../Tsukamoto';
    import { myToast } from '../UIs';
    import Swal from 'sweetalert2';

    // menurunkan dari kelas Tsukamoto
    class Fuzzy extends Tsukamoto{
        constructor(j: number, u: number, f: number){
            super(j, u, f);
        }
    }

    // membuat class toast
    export class Toast extends myToast {
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
    }

    // inisialisasi variabel
    let jarak: number = 0;
    let p: number = 0;
    let l: number = 0;
    let ukuran: number = 0;
    let fas = [];
    let sigma_fas = 0;
    let harga: number = 0;
    let error_toast: myToast = new Toast('Mohon isi dengan lengkap!', '', 'error')
    let success_toast: myToast;

    function luas(){
        ukuran = p * l;
    }

    function check(){
        // hitung fasilitas
        sigma_fas = 0;
        if(fas.length > 0 && jarak > 0 && ukuran > 0){
            for (let i = 0; i < fas.length; i++) {
                sigma_fas = sigma_fas + parseInt(fas[i]);
            }
            // instansiasi
            let fuzzy = new Fuzzy(jarak, ukuran, sigma_fas);
            // hitung harga
            harga = fuzzy.Prediksi();
            // output
            success_toast = new Toast(`Prediksi harga sewa kos:\nRp ${harga}.000,00`, '', 'success');
            success_toast.show();
            // alert(`Prediksi harga sewa kos:\nRp ${harga}.000,00`)
        }else{
            error_toast.show();
        }
    }
</script>

<style>
    .bg-logo{
        background-color: #725232;
        color: white;
    }
</style>

<!-- Logo -->
<br /><br /><br />
<div class="text-center">
  <img src="assets/logo.png" alt="cekkosmu" id="logo" />
</div>
<!-- akhir Logo -->
<!-- Motto -->
<div class="text-center pt-3">
  <p id="moto">Kami di sini siap membantu</p>
</div>
<!-- akhir Motto -->
<!-- Input -->
<div class="row">
    <div class="col-4 input">
        <div class="">
            <label for="">JARAK TEMPAT KOS</label>
        </div>
        <div class="ml-auto mr-auto">
            <input type="number" bind:value={jarak} id="txtjarak">
        </div>
    </div>
    <div class="col-4 input ">
        <div class="">
            <label for="">LUAS KAMAR KOS</label>
        </div>
        <div class="">
            <table>
                <tr>
                    <td>Panjang (m)</td>
                    <td><input type="number" bind:value={p} on:change={luas} id="txtp" min=2 data-toggle="tooltip" title="Panjang Kamar"></td>
                </tr>
                <tr>
                    <td>Lebar (m)</td>
                    <td><input type="number" bind:value={l} on:change={luas} id="txtl" min=1 data-toggle="tooltip" title="Lebar Kamar"></td>
                </tr>
                <tr>
                    <td>Luas </td>
                    <td><input type="number" bind:value={ukuran} id="txtluas" data-toggle="tooltip" title="Luas Kamar" readonly></td>
                </tr>
            </table>
        </div>
    </div>
    <div class="col-4 input">
        <div class="">
            <label for="">FASILITAS</label>
        </div>
        <table id="fasilitas-container">
            <tr>
                <td><label><input type="checkbox" bind:group={fas} id="fas0" value="10"> Tempat tidur</label></td>
                <td><label><input type="checkbox" bind:group={fas} id="fas5" value="11"> Dapur</label></td>
            </tr>
            <tr>
                <td><label><input type="checkbox" bind:group={fas} id="fas1" value="6"> Meja</label></td>
                <td><label><input type="checkbox" bind:group={fas} id="fas6" value="14"> Wi-Fi</label></td>
            </tr>
            <tr>
                <td><label><input type="checkbox" bind:group={fas} id="fas2" value="7"> Almari</label></td>
                <td><label><input type="checkbox" bind:group={fas} id="fas7" value="15"> AC</label></td>
            </tr>
            <tr>
                <td><label><input type="checkbox" bind:group={fas} id="fas3" value="8"> Kursi & meja belajar </label></td>
                <td><label><input type="checkbox" bind:group={fas} id="fas8" value="13"> TV</label></td>
            </tr>
            <tr>
                <td><label><input type="checkbox" bind:group={fas} id="fas4" value="9"> Kamar mandi dalam </label></td>
                <td><label><input type="checkbox" bind:group={fas} id="fas9" value="12"> Laundry</label></td>
            </tr>
        </table>
    </div>
</div>
<!-- akhir input -->
<!-- Tombol -->
<div class="text-center mt-2">
    <button class="btn bg-logo" on:click={check}>Cek Harga</button>
</div>
<!-- akhir Tombol -->
