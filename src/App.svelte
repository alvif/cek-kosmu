<script lang="ts">
	import page from 'page';
	import Nav from './components/Nav.svelte';
	import Home from './routes/Home.svelte';
	import About from './routes/About.svelte';
	import Contact from './routes/Contact.svelte';
	import Kosan from './routes/Kosan.svelte';
	import ULogin from './user/index.user.svelte';
	import ALogin from './admin/index.admin.svelte';
	import OLogin from './ownerkos/index.ownerkos.svelte';
	import ADasbor from './admin/index.admin.svelte';
	import ODasbor from './ownerkos/index.ownerkos.svelte';
	import UDasbor from './user/index.user.svelte';
	import SUOwner from './ownerkos/SignUp.svelte';
	import SUser from './user/SignUp.svelte';
	import Cari from './routes/Cari.svelte';

	let current;

	page('/', ()=> (current = Home));
	page('/listkos', ()=> (current = Kosan));
	page('/about', ()=> (current = About));
	page('/contact', ()=> (current = Contact));
	page('/user/login', ()=> (current = ULogin));
	page('/admin/login', ()=> (current = ALogin));
	page('/owner/login', ()=> (current = OLogin));
	page('/admin/dasbor', ()=> (current = ADasbor));
	page('/owner/dasbor', ()=> (current = ODasbor));
	page('/user/dasbor', ()=> (current = UDasbor));
	page('/owner/signup', ()=> (current = SUOwner));
	page('/user/signup', ()=> (current = SUser));
	page('/carikos', ()=> (current = Cari));

	page.start();
</script>

<!-- Navbar -->
<Nav/>
<!-- Akhir Navbar -->
<!-- Content -->
<div class="container">
	<svelte:component this={current}/>
</div>
<!-- Akhir Content -->




