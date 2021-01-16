<script lang="ts">
	import navAdmin from './nav-item.admin.svelte';
	import navOwner from './nav-item.owner.svelte';
	import navUser from './nav-item.user.svelte';

	let current_item;

	switch (localStorage.getItem('login')) {
		case 'admin':
			current_item = navAdmin;
			break;
		case 'owner':
			current_item = navOwner;
			break;
		case 'user':
			current_item = navUser;
			break;
	
		default:
			break;
	}

</script>
<nav class="navbar fixed-top navbar-expand navbar-custom">
	<a class="navbar-brand" href="/">
		<img src="../assets/brand.png" width="123" height="39" class="d-inline-block align-top" alt="brand"
			loading="lazy">
	</a>
	<ul class="navbar-nav ml-auto">
		<ul class="nav-item">
			<a href="/" class="nav-link text-white">Home</a>
		</ul>
		<ul class="nav-item">
			<a href="/carikos" class="nav-link text-white">Cari</a>
		</ul>
		<ul class="nav-item">
			<a href="/listkos" class="nav-link text-white">Tempat Kos</a>
		</ul>
		<ul class="nav-item">
			<a href="/contact" class="nav-link text-white">Contact</a>
		</ul>
		<ul class="nav-item">
			<a href="/about" class="nav-link text-white">About</a>
		</ul>
		<svelte:component this={current_item}/>
	</ul>
</nav>

<!-- <nav class="navbar navbar-expand-lg bg-dark navbar-dark">
	
	<a class="navbar-brand" href="#">Navbar</a>
  
	
	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
	  <span class="navbar-toggler-icon"></span>
	</button>
  
	
	<div class="collapse navbar-collapse" id="collapsibleNavbar">
	  <ul class="navbar-nav">
		<li class="nav-item">
		  <a class="nav-link" href="#">Link</a>
		</li>
		<li class="nav-item">
		  <a class="nav-link" href="#">Link</a>
		</li>
		<li class="nav-item">
		  <a class="nav-link" href="#">Link</a>
		</li>
	  </ul>
	</div>
  </nav>  -->