export abstract class UI{
    abstract show();
} 

export abstract class myToast extends UI{
    // Properti
    private _judul: string;
    private _teks: string;
    private _tipe: string;
    // Konstruktor
    constructor(judul: string, teks:string, tipe: string){
        super();
        this._judul = judul;
        this._teks = teks;
        this._tipe = tipe;
    }
    // Setter Getter
    public set judul(judul: string){
        this._judul = judul;
    }
    public get judul(){
        return this._judul;
    }
    public set teks(teks: string){
        this._teks = teks;
    }
    public get teks(){
        return this._teks;
    }
    public set tipe(tipe: string){
        this._tipe = tipe;
    }
    public get tipe(){
        return this._tipe;
    }
    // show Toast
    abstract show();
}


export class Image extends UI{
    /** properti */
    private id: string;
    private path: string;
    protected alt: string;
    protected width: number;
    protected height: number;

    /** konstruktor */
    constructor(id: string = '',path_img: string, alt: string = ''){
        super();
        this.id = id;
        this.path = path_img;
        this.alt = alt;
    }

    /** setter dan getter width height */
    public set setWidth(width:number){
        this.width = width;
    }

    public get getWidth(){
        return this.width;
    }

    public set setHeight(height:number){
        this.height;
    }    

    public get getHeight(){
        return this.height;
    }

    /** show image method */
    public show(){
        return `<img src="${this.path}" alt="${this.alt}" width="${this.width}" height="${this.height}" id="${this.id}">`;
    }
}

export class Input extends UI{
    private tipe: string;
    private value: string;
    private id: string;

    constructor(tipe: string, value: string, id: string){
        super();
        this.tipe = tipe;
        this.value = value;
        this.id = id;
    }

    public show(){

    }
}

export class myAlert{
    protected teks: string;
    protected tipe: string;

    constructor(teks: string, tipe: string){
        this.teks = teks;
        this.tipe = tipe;
    }

    public showAlert(){
        return `<div class="alert alert-${this.tipe}" role="alert">${this.teks}</div>`;
    }
}

