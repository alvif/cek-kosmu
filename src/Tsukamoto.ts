/**
 * Class Tsukamoto
 * menghitung prediksi harga kos metode fuzzy tsukamoto
 * @param jarak
 * @param ukuran
 * @param fasilitas
 */
export class Tsukamoto {
	private _jarak: number;
	private _ukuran: number;
	private _fasilitas: number = 0;
	private alpha_arr: number[] = new Array(18);
	private z_arr: number[] = new Array(18);

	// konstructor untuk class Tsukamoto
	constructor(jarak: number, ukuran: number, fasilitas: number) {
		this._jarak = jarak;
		this._ukuran = ukuran;
		this._fasilitas = fasilitas;
	}

	/**
	 * setter nilai jarak
	 */
	set jarak(j: number) {
		this._jarak = j;
	}

	/**
	 * setter nilai ukuran
	 */
	set ukuran(u: number) {
		this._ukuran = u;
	}

	/**
	 * setter nilai fasilitas
	 */
	set fasilitas(f: number) {
		this._fasilitas = f;
	}

	/**
	 * get nilai jarak
	 * @return jarak
	 */
	get jarak() {
		return this._jarak;
	}

	/**
	 * get nilai ukuran
	 * @return ukuran
	 */
	get ukuran() {
		return this._ukuran;
	}

	/**
	 * get nilai fasilitas
	 * @return fasilitas
	 */
	get fasilitas() {
		return this._fasilitas;
	}

	/**
	 * Mencari nilai terkecil dari tiga variabel
	 * @param x 
	 * @param y 
	 * @param z 
	 * @return nilai terkecil
	 */
	private CariMin(x: number, y: number, z: number) {
		if (x <= y && x <= z) {
			return x;
		} else if (y <= x && y <= z) {
			return y;
		} else {
			return z;
		}
	}

	/**
	 * Mencari nilai keanggotaan himpunan fasilitas biasa
	 * @return nilai keanggotaan pada himpunan fasilitas biasa
	 */
	private FasilitasBiasa() {
		if (this.fasilitas <= 20) {
			return 1;
		} else if (this.fasilitas > 20 && this.fasilitas < 70) {
			return (70 - this.fasilitas) / 50;
		} else {
			return 0;
		}
	}

	/**
	 * Mencari nilai keanggotaan himpunan fasilitas lengkap
	 * @return nilai keanggotaan pada himpunan fasilitas lengkap
	 */
	private FasilitasLengkap() {
		if (this.fasilitas >= 70) {
			return 1;
		} else if (this.fasilitas > 20 && this.fasilitas < 70) {
			return (this.fasilitas - 20) / 50;
		} else {
			return 0;
		}
	}

	/**
	 *  mencari nilai keanggotaan himpunan jarak dekat
	 *  @return nilai keanggotaan di himpunan jarak dekat
	 */
	private JarakDekat() {
		if (this.jarak <= 1) {
			return 1;
		} else if (this.jarak > 1 && this.jarak < 3) {
			return (3 - this.jarak) / 2;
		} else {
			return 0;
		}
	}

	/**
	 *  mencari nilai keanggotaan himpunan jarak sedang
	 *  @return nilai keanggotaan di himpunan jarak sedang
	 */
	private JarakSedang() {
		if (this.jarak >= 3 && this.jarak <= 5) {
			return 1;
		} else if (this.jarak > 1 && this.jarak < 3) {
			return (this.jarak - 1) / 2;
		} else if (this.jarak > 5 && this.jarak < 7) {
			return (7 - this.jarak) / 2;
		} else {
			return 0;
		}
	}

	/**
	 *  mencari nilai keanggotaan himpunan jarak jauh
	 *  @return nilai keanggotaan di himpunan jarak jauh
	 */
	private JarakJauh() {
		if (this.jarak >= 7) {
			return 1;
		} else if (this.jarak > 5 && this.jarak < 7) {
			return (this.jarak - 5) / 2;
		} else {
			return 0;
		}
	}

	/**
	 *  mencari nilai keanggotaan himpunan ukuran sempit
	 *  @return nilai keanggotaan di himpunan ukuran sempit
	 */
	private UkuranSempit() {
		if (this.ukuran <= 4) {
			return 1;
		} else if (this.ukuran > 4 && this.ukuran < 8) {
			return (8 - this.ukuran) / 4;
		} else {
			return 0;
		}
	}

	/**
	 *  mencari nilai keanggotaan himpunan ukuran sedang
	 *  @return nilai keanggotaan di himpunan ukuran sedang
	 */
	private UkuranSedang() {
		if (this.ukuran >= 8 && this.ukuran <= 15) {
			return 1;
		} else if (this.ukuran > 4 && this.ukuran < 8) {
			return (this.ukuran - 4) / 4;
		} else if (this.ukuran > 15 && this.ukuran < 18) {
			return (18 - this.ukuran) / 3;
		} else {
			return 0;
		}
	}


	/**
	 *  mencari nilai keanggotaan himpunan ukuran luas
	 *  @return nilai keanggotaan di himpunan ukuran luas
	 */
	private UkuranLuas() {
		if (this.ukuran >= 18) {
			return 1;
		} else if (this.ukuran > 15 && this.ukuran < 18) {
			return (this.ukuran - 15) / 3;
		} else {
			return 0;
		}
	}

	/**
	 * Mencari harga di himpunan harga murah
	 * @param alpha 
	 * @return harga
	 */
	private HargaMurah(alpha: number) {
		if (alpha > 0 && alpha < 1) {
			return (900 - alpha * 600);
		} else if (alpha == 1) {
			return 300;
		} else {
			return 900;
		}
	}

	/**
	 * Mencari harga di himpunan harga mahal
	 * @param alpha 
	 * @return harga
	 */
	private HargaMahal(alpha: number) {
		if (alpha > 0 && alpha < 1) {
			return (300 + alpha * 600);
		} else if (alpha == 1) {
			return 900;
		} else {
			return 300;
		}
	}

	/**
	 *  mencari nilai z untuk semua aturan yang ada
	 */
	private Inferensi() {
		//1. Jika fasilitas BIASA dan ukuran SEMPIT dan jarak DEKAT maka harga MAHAL
		this.alpha_arr[0] = this.CariMin(this.FasilitasBiasa(), this.UkuranSempit(), this.JarakDekat());
		this.z_arr[0] = this.HargaMahal(this.alpha_arr[0]);
		//2. Jika fasilitas BIASA dan ukuran SEMPIT dan jarak SEDANG maka harga MURAH
		this.alpha_arr[1] = this.CariMin(this.FasilitasBiasa(), this.UkuranSempit(), this.JarakSedang());
		this.z_arr[1] = this.HargaMurah(this.alpha_arr[1]);
		//3. Jika fasilitas BIASA dan ukuran SEMPIT dan jarak JAUH maka harga MURAH
		this.alpha_arr[2] = this.CariMin(this.FasilitasBiasa(), this.UkuranSempit(), this.JarakJauh());
		this.z_arr[2] = this.HargaMurah(this.alpha_arr[2]);
		//4. Jika fasilitas BIASA dan ukuran SEDANG dan jarak DEKAT maka harga MAHAL
		this.alpha_arr[3] = this.CariMin(this.FasilitasBiasa(), this.UkuranSedang(), this.JarakDekat());
		this.z_arr[3] = this.HargaMahal(this.alpha_arr[3]);
		//5. Jika fasilitas BIASA dan ukuran SEDANG dan jarak SEDANG maka harga MURAH
		this.alpha_arr[4] = this.CariMin(this.FasilitasBiasa(), this.UkuranSedang(), this.JarakSedang());
		this.z_arr[4] = this.HargaMurah(this.alpha_arr[4]);
		//6. Jika fasilitas BIASA dan ukuran SEDANG dan jarak JAUH maka harga MURAH
		this.alpha_arr[5] = this.CariMin(this.FasilitasBiasa(), this.UkuranSedang(), this.JarakJauh());
		this.z_arr[5] = this.HargaMurah(this.alpha_arr[5]);
		//7. Jika fasilitas BIASA dan ukuran LUAS dan jarak DEKAT maka harga MAHAL
		this.alpha_arr[6] = this.CariMin(this.FasilitasBiasa(), this.UkuranLuas(), this.JarakDekat());
		this.z_arr[6] = this.HargaMahal(this.alpha_arr[6]);
		//8. Jika fasilitas BIASA dan ukuran LUAS dan jarak SEDANG maka harga MURAH
		this.alpha_arr[7] = this.CariMin(this.FasilitasBiasa(), this.UkuranLuas(), this.JarakSedang());
		this.z_arr[7] = this.HargaMurah(this.alpha_arr[7]);
		//9. Jika fasilitas BIASA dan ukuran LUAS dan jarak JAUH maka harga MURAH
		this.alpha_arr[8] = this.CariMin(this.FasilitasBiasa(), this.UkuranLuas(), this.JarakJauh());
		this.z_arr[8] = this.HargaMurah(this.alpha_arr[8]);
		//10. Jika fasilitas LENGKAP dan ukuran SEMPIT dan jarak DEKAT maka harga MAHAL
		this.alpha_arr[9] = this.CariMin(this.FasilitasLengkap(), this.UkuranSempit(), this.JarakDekat());
		this.z_arr[9] = this.HargaMahal(this.alpha_arr[9]);
		//11. Jika fasilitas LENGKAP dan ukuran SEMPIT dan jarak SEDANG maka harga MAHAL
		this.alpha_arr[10] = this.CariMin(this.FasilitasLengkap(), this.UkuranSempit(), this.JarakSedang());
		this.z_arr[10] = this.HargaMahal(this.alpha_arr[10]);
		//12. Jika fasilitas LENGKAP dan ukuran SEMPIT dan jarak JAUH maka harga MURAH
		this.alpha_arr[11] = this.CariMin(this.FasilitasLengkap(), this.UkuranSempit(), this.JarakJauh());
		this.z_arr[11] = this.HargaMurah(this.alpha_arr[11]);
		//13. Jika fasilitas LENGKAP dan ukuran SEDANG dan jarak DEKAT maka harga MAHAL
		this.alpha_arr[12] = this.CariMin(this.FasilitasLengkap(), this.UkuranSedang(), this.JarakDekat());
		this.z_arr[12] = this.HargaMahal(this.alpha_arr[12]);
		//14. Jika fasilitas LENGKAP dan ukuran SEDANG dan jarak SEDANG maka harga MAHAL
		this.alpha_arr[13] = this.CariMin(this.FasilitasLengkap(), this.UkuranSedang(), this.JarakSedang());
		this.z_arr[13] = this.HargaMahal(this.alpha_arr[13]);
		//15. Jika fasilitas LENGKAP dan ukuran SEDANG dan jarak JAUH maka harga MURAH
		this.alpha_arr[14] = this.CariMin(this.FasilitasLengkap(), this.UkuranSedang(), this.JarakJauh());
		this.z_arr[14] = this.HargaMurah(this.alpha_arr[14]);
		//16. Jika fasilitas LENGKAP dan ukuran LUAS dan jarak DEKAT maka harga MAHAL
		this.alpha_arr[15] = this.CariMin(this.FasilitasLengkap(), this.UkuranLuas(), this.JarakDekat());
		this.z_arr[15] = this.HargaMahal(this.alpha_arr[15]);
		//17. Jika fasilitas LENGKAP dan ukuran LUAS dan jarak SEDANG maka harga MAHAL
		this.alpha_arr[16] = this.CariMin(this.FasilitasLengkap(), this.UkuranLuas(), this.JarakSedang());
		this.z_arr[16] = this.HargaMahal(this.alpha_arr[16]);
		//18. Jika fasilitas LENGKAP dan ukuran LUAS dan jarak JAUH maka harga MURAH
		this.alpha_arr[17] = this.CariMin(this.FasilitasLengkap(), this.UkuranLuas(), this.JarakJauh());
		this.z_arr[17] = this.HargaMurah(this.alpha_arr[17]);
	}

	/**
	 *  mencari nilai total z(defuzzyfikasi)
	 *  @return nilai total z
	 */
	private Defuzzyfikasi() {
		let temp1: number = 0;
		let temp2: number = 0;
		let hasil: number = 0;

		for (let i = 0; i < 18; i++) {
			temp1 = temp1 + this.alpha_arr[i] * this.z_arr[i];
			temp2 = temp2 + this.alpha_arr[i];
		}

		hasil = temp1 / temp2;

		return Math.round(hasil);
	}

	/**
	 * Menghitung harga sewa kos
	 * @return prediksi harga
	 */
	public Prediksi() {
		this.Inferensi();
		return this.Defuzzyfikasi();
	}
}
