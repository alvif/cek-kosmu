<script lang="ts">
  import axios from 'axios';
  import { Image } from '../UIs'

  let logo = new Image('logo', 'assets/logo.png', 'logo');

  function doSignUP(type:string){
    if(type === 'pencarikos'){
      window.open('http://localhost:5000/user/signup', '_self');
    }else if(type === 'pemilikkos'){
      window.open('http://localhost:5000/owner/signup', '_self');
    }
  }

  function doSignIn(type:string){
    if(type === 'pencarikos'){
      window.open('http://localhost:5000/user/login', '_self');
    }else if(type === 'pemilikkos'){
      window.open('http://localhost:5000/owner/login', '_self');
    }
  }

</script>

<!-- Logo -->
<br /><br /><br />
<div class="text-center">
  {@html logo.show()}
</div>
<!-- akhir Logo -->
<!-- Motto -->
<div class="text-center pt-3">
  <p id="moto">Kami di sini siap membantu</p>
</div>
<!-- akhir Motto -->

<!-- trigger modal -->
<div class="tombol text-center mt-5">
  {#if localStorage.getItem('admin') || localStorage.getItem('owner') || localStorage.getItem('user')}
  <!-- hide button -->
  {:else}
    <button
      class="btn btn-info"
      data-toggle="modal"
      data-target="#SignUpModal">Sign Up</button>
    <button
      class="btn btn-success"
      data-toggle="modal"
      data-target="#SignInModal">Sign in</button><br><br>
    
    <!-- <form action="http://localhost:3002/owners/upload/imgkosan" method="POST" enctype="multipart/form-data">
      <input type="file" accept="image/*" name="file" id="file">
      <button type="submit">UP</button>
    </form> -->
  {/if}
</div>

<!-- signup modal -->
<div class="modal" data-backdrop="static" tabindex="-1" role="dialog" id="SignUpModal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Sign Up</h5>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body text-center">
        <p>Sign Up sebagai : </p>
        <button class="btn btn-primary" on:click={() => doSignUP('pencarikos')}>Pencari Kos</button>
        <button class="btn btn-warning" on:click={() => doSignUP('pemilikkos')}>Pemilik Kos</button>
      </div>
    </div>
  </div>
</div>

<!-- signin modal -->
<div class="modal" data-backdrop="static" tabindex="-1" role="dialog" id="SignInModal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Sign In</h5>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body text-center">
        <p>Sign In sebagai : </p>
        <button class="btn btn-primary" on:click={() => doSignIn('pencarikos')}>Pencari Kos</button>
        <button class="btn btn-warning" on:click={() => doSignIn('pemilikkos')}>Pemilik Kos</button>
      </div>
    </div>
  </div>
</div>

