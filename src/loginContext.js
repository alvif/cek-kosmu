import { writable } from 'svelte/store';

const store = () => {

  const login = {
    nama: undefined,
    token: undefined,
    level: undefined
  }

  const { subscribe, set, update } = writable(login)

  const method = {
    init() {
      update(login => {
        login.nama = '';
        login.token = '';
        login.level = '';
        return login;
      })
    },
    setNama(nama){
      update(login => {
        login.nama = nama;
        return login;
      })
    },
    setToken(token){
      update(login => {
        login.token = token;
        return login;
      })
    },
    setLevel(level){
      update(login => {
        login.level = level;
        return login;
      })
    }
  }

  return {
    subscribe,
    set,
    update,
    ...method
  }
}

export default store()