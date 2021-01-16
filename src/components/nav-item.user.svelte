<script lang="ts">
  function logout() {
    localStorage.clear();
    window.open("http://localhost:5000/user/login", "_self");
  }
</script>

<li class="nav-item dropdown ml-4">
  <a class="nav-link dropdown-toggle text-white" href="#anu" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    User
  </a>
  <div class="dropdown-menu" aria-labelledby="navbarDropdown">
    <!-- <a class="dropdown-item" href="#">Profil</a> -->
    <a class="dropdown-item" href="/user/dasbor">Dasbor</a>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item" href="#logout" on:click={logout}>Logout</a>
  </div>
</li>