<script lang="ts">
  import Dasbor from './Dasbor.svelte'
  import Login from './Login.svelte'
</script>

{#if localStorage.getItem('login') == 'user'}
  <svelte:component this={Dasbor}/>
{:else}
  <svelte:component this={Login}/>
{/if}