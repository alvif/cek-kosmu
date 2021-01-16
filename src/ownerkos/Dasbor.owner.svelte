<script lang="ts">
  import Edit from './components/components.edit.svelte';
  import Tambah from './components/components.tambah.svelte';
  import Pemesanan from './components/components.pemesanan.svelte';

  let component = Edit;

  function pilihComponent(n: number) {
    
    if (n == 1) {
      component = Edit;
    } else if (n == 2) {
      component = Tambah;
    } else {
      component = Pemesanan;
    }
  }
</script>

<style>
  .admin {
    margin-top: 100px;
  }
  .card-header-tabs, .card-header{
    background-color: #FFD38D;
  }
  .nav-link{
    color: #725232;
  }
</style>

<div class="admin">
  <div class="card text-center">
    <div class="card-header">
      <ul class="nav nav-tabs card-header-tabs" id="myTab">
        <li class="nav-item">
          <a
            class="nav-link active"
            href="#edit"
            on:click={() => pilihComponent(1)}>Edit Data Kosan</a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            href="#tambah"
            on:click={() => pilihComponent(2)}>Tambah</a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            href="#pemesanan"
            on:click={() => pilihComponent(3)}>Pemesanan</a>
        </li>
      </ul>
    </div>
    <div class="card-body">
      <svelte:component this={component} />
    </div>
  </div>
</div>
