<script lang="ts">
  import axios from 'axios';
  import Dasbor from './Dasbor.owner.svelte';
  import { myAlert } from '../UIs';
  import { Login } from '../Login';

  // class Owner extends Login{
  //   constructor(username:string){
  //     super(username);
  //   }
  // }

  let login_state: number;
  let uname: string;
  let pass: string;
  let result;
  let LOGIN_API_URL = 'http://localhost:3002/owners/login'

  export async function doLogin() {
        try {
            const response = await axios.post(LOGIN_API_URL, {
              username: uname,
              password: pass
            });

            result = response.data;

            if(result.message == "Berhasil login"){
              window.open("http://localhost:5000/owner/dasbor", "_self");
              // set localStorage
              localStorage.setItem('owner', result.token);
              localStorage.setItem('id_owner', result.id_owner);
              localStorage.setItem('nama_owner', result.username);
              localStorage.setItem('login', 'owner');
            }else{
              login_state = 1;
            }
        } catch (error) {
            login_state = 1;
        }
    }

  let notif = new myAlert('Password salah! Mohon ulangi lagi.', 'danger');

  // function login(){
  //   try {
  //     let owner = new Login(uname);
  //     owner.username = uname;
  //     owner.password = pass;
  //     owner.lvl = 'admin';
  //     owner.apiURL = "http://localhost:3002/admin/login"
  //     owner.doLogin(owner.lvl);
  //     login_state = owner.login_state;
  //     res = owner.res.username;
  //   } catch (error) {
  //     alert(error);
  //     console.log(error);
  //     login_state = -1;
  //   }
  // }
</script>

{#if localStorage.getItem('login') == 'owner'}
  <svelte:component this={Dasbor}/>
{:else}
  <div class="d-flex justify-content-center mt-5">
    <div class="card shadow card-bg" style="width: 25rem; margin-top: 70px">
        <div class="card-body">
          <h3 class="card-title mb-5">Owner Login</h3>
          {#if login_state == -1}
            {@html notif.showAlert()}
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
          Belum punya akun?
          <a href="http://localhost:5000/owner/signup">Signup disini</a>
        </div>
      </div>
  </div>
{/if}