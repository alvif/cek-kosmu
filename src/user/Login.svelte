<script lang="ts">
  import { myAlert } from "../UIs";
  import axios from "axios";
  import { Login } from "../Login"

  let uname: string;
  let pass: string;
  let login_state: number = 0;
  let notiflogin = new myAlert("Username atau password salah!", "danger");
  let res;

  async function login() {
    try {
      const response = await axios.post("https://cek-kosmu-server.herokuapp.com/users/login", {
        username: uname,
        password: pass,
      });
      res = response.data;
      if (res.message == "Berhasil login") {
        window.open("http://localhost:5000/user/dasbor", "_self");
        localStorage.setItem("user", res.token);
        localStorage.setItem("id_user", res.id_user);
        localStorage.setItem("nama_user", res.username);
        localStorage.setItem("login", "user");
      } else {
        login_state = -1;
      }
    } catch (error) {
      login_state = -1;
    }
  }

  async function login1() {
    try {
      fetch('https://cek-kosmu-server.herokuapp.com/users/login', {
        method: "POST",
        headers: {"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
        body: JSON.stringify({
          username: uname, 
          password: pass
        })
      })
      .then(response => response.json()) 
      .then(json => console.log(json))
      .catch(err => alert(err));
      // if (res.message == "Berhasil login") {
      //   window.open("http://localhost:5000/user/dasbor", "_self");
      //   localStorage.setItem("user", res.token);
      //   localStorage.setItem("nama_user", res.username);
      //   localStorage.setItem("login", "user");
      // } else {
      //   login_state = -1;
      // }
    } catch (error) {
      alert(error);
      login_state = -1;
    }
  }

</script>

<div class="d-flex justify-content-center mt-4">
  <div class="card shadow card-bg" style="width: 25rem; margin-top: 70px">
    <div class="card-body">
      <h3 class="card-title mb-5">User Login</h3>
      {#if login_state === -1}
        {@html notiflogin.showAlert()}
      {/if}
      <div class="mb-3">
        <label for="txtusernamae" class="form-label">Username</label>
        <input
          type="text"
          class="form-control"
          id="txtusernamae"
          placeholder=""
          bind:value={uname} />
      </div>
      <div class="mb-3">
        <label for="txtpassword" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="txtpassword"
          placeholder=""
          bind:value={pass} />
      </div>
      <div class="mb-3">
        <button
          type="button"
          class="btn btn-success mb-1"
          on:click={login}>Login</button>
        <p>
          Belum punya akun?
          <a href="http://localhost:5000/user/signup">Daftar disini</a>
        </p>
      </div>
    </div>
  </div>
</div>
