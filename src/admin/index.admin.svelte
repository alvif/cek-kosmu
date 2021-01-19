<script lang="ts">
    import { myAlert } from '../UIs';
    import axios from 'axios';
    import Dasbor from './Dasbor.svelte';
    import store from '../loginContext'

    let result = {
      message: '',
      username: '',
      token: ''
    };

    let uname: string;
    let pass: string;
    let login_state:number = 0; 
    let LOGIN_API_URL = "https://cek-kosmu-server.herokuapp.com//admin/login"

    class NotifAlert extends myAlert{
      private role: string;

      constructor(tipe: string, teks:string, role: string,){
        super(teks, tipe);
        this.role = role;
      }

      showNotif(){
        return `<div class="alert alert-${this.tipe}" role="${this.role}">${this.teks}</div>`;
      }
    }

    let notif = new NotifAlert('danger', 'Username atau Password salah!!', 'alert');

    export async function doLogin() {
        try {
            const response = await axios.post(LOGIN_API_URL, {
              username: uname,
              password: pass
            });

            result = response.data;

            if(result.message == "Berhasil login"){
              window.open("http://localhost:5000/admin/dasbor", "_self");
              // set localStorage
              localStorage.setItem('admin', result.token);
              localStorage.setItem('nama_admin', result.username);
              localStorage.setItem('login', 'admin');
              store.init();
              store.setNama(result.username);
              store.setToken(result.token);
              store.setLevel('admin');
              console.log('lS admin = '+localStorage.getItem('admin'))
              console.log('lS nama = '+localStorage.getItem('nama_admin'))
              console.log('lS login = '+localStorage.getItem('login'))
              // console.log($store.nama)
              // console.log($store.level)
              // console.log($store.token)
            }else{
              login_state = 1;
            }
        } catch (error) {
            login_state = 1;
        }
    }
</script>

{#if localStorage.getItem('login') == 'admin'}
    <svelte:component this={Dasbor}/>
{:else}
    <div class="d-flex justify-content-center mt-5">
        <div class="card shadow card-bg" style="width: 25rem; margin-top: 70px">
            <div class="card-body">
              <h3 class="card-title mb-5">Admin Login</h3>
              {#if login_state == 1}
                {@html notif.showNotif()}
              {/if}
              <div class="mb-3">
                <label for="txtusernamae" class="form-label">Username</label>
                <input type="text" class="form-control" id="txtusernamae" bind:value={uname}>
              </div>
              <div class="mb-3">
                <label for="txtpassword" class="form-label">Password</label>
                <input type="password" class="form-control" id="txtpassword" bind:value={pass}>
              </div>
              <div class="mb-3">
                <button type="button" class="btn btn-success" on:click={doLogin}>Login</button>
              </div>
            </div>
          </div>
    </div>
{/if}
