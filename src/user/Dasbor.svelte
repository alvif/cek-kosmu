<script lang="ts">
    import { myToast } from "../UIs";
    import { Users } from "../User"
    import Swal from "sweetalert2";
    import axios from "axios";

    let data_pesanan = [];
    let data_transaksi = [];

    let selected_index: number = 0;
    let selected_index_p: number = 0;

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

    class User extends Users{
        private id_user: number;

        constructor(id:number){
            super();
            this.id_user = id;
        }

        getPesanan(){
            try {
                axios.get('https://cek-kosmu-server.herokuapp.com//users/pesanan',{
                    headers : {
                        Authorization: localStorage.getItem('user'),
                        id_user: this.id_user
                    }
                })
                .then((res) => {
                    let respon = res.data;
                    data_pesanan = respon.data;
                });
            } catch (error) {
                alert(error);
            }
        }

        getTransaksi(){
            try {
                axios.get('https://cek-kosmu-server.herokuapp.com//users/transaksi',{
                    headers : {
                        Authorization: localStorage.getItem('user'),
                        id_user: this.id_user
                    }
                })
                .then((res) => {
                    let respon = res.data;
                    data_transaksi = respon.data;
                });
            } catch (error) {
                
            }
        }

        tambahPembayaran(){
            try {
                const headers = new Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                headers.append('Authorization', localStorage.getItem('user'));

                const body = `id_penyewa=${data_pesanan[selected_index].id_user}&id_kos=${data_pesanan[selected_index].id_kos}&n_kamar=${data_pesanan[selected_index].n_kamar}&nominal=${data_pesanan[selected_index].nominal}`;

                const init = {
                    method: 'POST',
                    headers,
                    body
                };

                fetch('https://cek-kosmu-server.herokuapp.com//users/tambah-transaksi', init)
                .then((response) => {
                    console.log(response.json());
                    alert('Berhasil! Silahkan lanjut ke pembayaran!');
                })
                .catch((e) => {
                // error in e.message
                    alert(e.message);
                });
            } catch (error) {
                alert(error);
            }
        }

        konfirmasiPembayaran(){
            try {
                if(selected_index_p < 0){
                    alert('Mohon pilih transaksi!');
                    return;
                }
                axios.post('https://cek-kosmu-server.herokuapp.com//users/selesaikan-transaksi',{
                    status_pembayaran: 'selesai(user)',
                }, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization' : localStorage.getItem('user'),
                        'id_transaksi': data_transaksi[selected_index_p].id_transaksi,
                        'id_penyewa': data_transaksi[selected_index_p].id_penyewa,
                        'id_kos': data_transaksi[selected_index_p].id_kosan
                    }
                })
                .then((res) => {
                    let respon = res.data;
                    alert(respon.message);
                });
            } catch (error) {
                alert(error);
            }
        }
    }

    function getInfoPesanan(index: number){
        let keterangan: string = ``;
        // index array data pesanan yang diklik
        selected_index = index;
        keterangan = `
        <strong>Info Pemesanan</strong>
        <table class="text-left">
        <tr style="line-height: 25px;">
            <td>Id Pemesanan</td><td>:</td><td>${data_pesanan[index].id_pesanan}</td>
        </tr>
        <tr style="line-height: 25px;">
            <td>Lama Sewa</td><td>:</td><td>${data_pesanan[index].lama_tinggal} bulan</td>
        </tr>
        <tr style="line-height: 25px;">
            <td>Kamar dipesan</td><td>:</td><td>${data_pesanan[index].n_kamar} unit</td>
        </tr>
        <tr style="line-height: 25px;">
            <td>Ketersediaan Kamar</td><td>:</td><td>${data_pesanan[index].ketersediaan}</td>
        </tr>
        </table>
        `
        // show keterangan
        document.getElementById('ket').innerHTML = keterangan;
    }

    function getInfoPembayaran(index: number){
        let keterangan: string = ``;
        // index array data pesanan yang diklik
        selected_index_p = index;
        keterangan = `
        <strong>Info Pemesanan</strong>
        <table class="text-left">
        <tr style="line-height: 25px;">
            <td>Id Transaksi</td><td>:</td><td>${data_transaksi[index].id_transaksi}</td>
        </tr>
        <tr style="line-height: 25px;">
            <td>Kode Transaksi</td><td>:</td><td>${data_transaksi[index].kode_transaksi}</td>
        </tr>
        <tr style="line-height: 25px;">
            <td>Nominal</td><td>:</td><td>Rp ${data_transaksi[index].nominal}</td>
        </tr>
        <tr style="line-height: 25px;">
            <td>Kamar dipesan</td><td>:</td><td>${data_transaksi[index].n_kamar} unit</td>
        </tr>
        <tr style="line-height: 25px;">
            <td>Status Transaksir</td><td>:</td><td>${data_transaksi[index].status_transaksi}</td>
        </tr>
        </table>
        `
        // show keterangan
        document.getElementById('ketp').innerHTML = keterangan;
    }

    let time = function () {
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
    };

    let waktu: string = time();
    let nama: string = localStorage.getItem("nama_user");
    // Instansiasi objek toast
    let info_toast = new Toast(
        `Berhasil login! Selamat ${waktu} ${nama}`,
        "",
        "success"
    );
    
    // pesan welcome
    info_toast.show();

    let Usr: User = new User(parseInt(localStorage.getItem('id_user')));
    Usr.getPesanan();
    Usr.getTransaksi();
</script>

<style>
    .nav-pills > .active {
        background-color: #ffd38d;
    }
    .nav-link {
        color: #725232;
    }

    .dasbor{
        height: 400px;
    }

    .list {
        height: 250px;
        overflow-y: scroll;
        text-align: left;
    }

    .keterangan {
        height: 250px;
    }
</style>

<div class="mt-5 pt-4">
    <div class="row border rounded p-2 bg-white dasbor">
        <div class="col-3 pt-3 pb-2 bg-white" id="user-menu">
            <div
                class="nav flex-column nav-pills text-left"
                id="v-pills-tab"
                role="tablist"
                aria-orientation="vertical">
                <a
                    class="nav-link active"
                    id="v-pills-home-tab"
                    data-toggle="pill"
                    href="#v-pills-home"
                    role="tab"
                    aria-controls="v-pills-home"
                    aria-selected="true">Pemesanan</a>
                <a
                    class="nav-link"
                    id="v-pills-profile-tab"
                    data-toggle="pill"
                    href="#v-pills-profile"
                    role="tab"
                    aria-controls="v-pills-profile"
                    aria-selected="false" on:click={() => Usr.getTransaksi()}>Pembayaran</a>
                <a
                    class="nav-link"
                    id="v-pills-messages-tab"
                    data-toggle="pill"
                    href="#v-pills-messages"
                    role="tab"
                    aria-controls="v-pills-messages"
                    aria-selected="false">Messages</a>
                <a
                    class="nav-link"
                    id="v-pills-settings-tab"
                    data-toggle="pill"
                    href="#v-pills-settings"
                    role="tab"
                    aria-controls="v-pills-settings"
                    aria-selected="false">Profiles</a>
            </div>
        </div>
        <div class="col-9">
            <div class="tab-content" id="v-pills-tabContent">
                <div
                    class="tab-pane fade show active"
                    id="v-pills-home"
                    role="tabpanel"
                    aria-labelledby="v-pills-home-tab">
                    <div class="d-flex align-items-center pt-4">
                        <div class="col-4 mb-3">
                            <strong>List Pesanan Kamar</strong>
                            <div class="list">
                                {#each data_pesanan as data, i}
                                <div class="pesanan" on:click={() => getInfoPesanan(i)}>
                                    <strong>Id pesanan: {data.id_pesanan}</strong>
                                </div>
                                {/each}
                            </div>
                        </div>
                        <div class="col-4">
                            <strong>Keterangan</strong>
                            <div class="keterangan" id='ket'>

                            </div>
                        </div>
                        <div class="col-4">
                            <button class="btn btn-success p-2" on:click={() => Usr.tambahPembayaran()}>Lanjutkan Pembayaran</button><br><br>
                            <button class="btn btn-danger p-2">Batalkan Pemesanan</button>
                        </div>
                    </div>
                </div>
                <div
                    class="tab-pane fade"
                    id="v-pills-profile"
                    role="tabpanel"
                    aria-labelledby="v-pills-profile-tab">
                    <div class="row">
                        <div class="col-4 mb-3">
                            <strong>Pembayaran</strong>
                            <div class="list">
                                {#each data_transaksi as data, i}
                                <div class="pesanan" on:click={() => getInfoPembayaran(i)}>
                                    <strong>Id Pembayaran: {data.id_transaksi}</strong>
                                </div>
                                {/each}
                            </div>
                        </div>
                        <div class="col-4">
                            <strong>Keterangan</strong>
                            <div class="keterangan" id='ketp'></div>
                        </div>
                        <div class="col-4">
                            <button class="btn btn-success p-2" on:click={() => Usr.konfirmasiPembayaran()}>Bayar Sekarang</button><br><br>
                            <button class="btn btn-danger p-2">Batalkan Pemesanan</button>
                        </div>
                    </div>
                </div>
                <div
                    class="tab-pane fade"
                    id="v-pills-messages"
                    role="tabpanel"
                    aria-labelledby="v-pills-messages-tab">
                    SEGERA HADIR :)
                </div>
                <div
                    class="tab-pane fade"
                    id="v-pills-settings"
                    role="tabpanel"
                    aria-labelledby="v-pills-settings-tab">
                    SEGERA HADIR :)
                </div>
            </div>
        </div>
    </div>
</div>
