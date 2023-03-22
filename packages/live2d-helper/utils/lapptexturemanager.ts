// @ts-nocheck
/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { csmVector, iterator } from 'framework/src/type/csmvector';

import { gl } from './lappdelegate';

/**
 * テクスチャ管理クラス
 * 画像読み込み、管理を行うクラス。
 */
export class LAppTextureManager {
  /**
   * コンストラクタ
   */
  constructor() {
    this._textures = new csmVector<TextureInfo>();
  }

  /**
   * 解放する。
   */
  public release(): void {
    for (
      let ite: iterator<TextureInfo> = this._textures.begin();
      ite.notEqual(this._textures.end());
      ite.preIncrement()
    ) {
      gl.deleteTexture(ite.ptr().id);
    }
    this._textures = null;
  }

  /**
   * 画像読み込み
   *
   * @param fileName 読み込む画像ファイルパス名
   * @param usePremultiply Premult処理を有効にするか
   * @return 画像情報、読み込み失敗時はnullを返す
   */
  public createTextureFromPngFile(
    fileName: string,
    usePremultiply: boolean,
    callback: (textureInfo: TextureInfo) => void
  ): void {
    // search loaded texture already
    for (
      let ite: iterator<TextureInfo> = this._textures.begin();
      ite.notEqual(this._textures.end());
      ite.preIncrement()
    ) {
      if (
        ite.ptr().fileName == fileName &&
        ite.ptr().usePremultply == usePremultiply
      ) {
        // 2回目以降はキャッシュが使用される(待ち時間なし)
        // WebKitでは同じImageのonloadを再度呼ぶには再インスタンスが必要
        // 詳細：https://stackoverflow.com/a/5024181
        ite.ptr().img = new Image();
        ite.ptr().img.onload = (): void => callback(ite.ptr());
        ite.ptr().img.src = fileName;
        return;
      }
    }

    // データのオンロードをトリガーにする
    const img = new Image();
    img.onload = (): void => {
      // テクスチャオブジェクトの作成
      const tex: WebGLTexture = gl.createTexture();

      // テクスチャを選択
      gl.bindTexture(gl.TEXTURE_2D, tex);

      // テクスチャにピクセルを書き込む
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      // Premult処理を行わせる
      if (usePremultiply) {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
      }

      // テクスチャにピクセルを書き込む
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img.res);

      // ミップマップを生成
      gl.generateMipmap(gl.TEXTURE_2D);

      // テクスチャをバインド
      gl.bindTexture(gl.TEXTURE_2D, null);

      const textureInfo: TextureInfo = new TextureInfo();
      if (textureInfo != null) {
        textureInfo.fileName = fileName;
        textureInfo.width = img.width;
        textureInfo.height = img.height;
        textureInfo.id = tex;
        textureInfo.img = img;
        textureInfo.usePremultply = usePremultiply;
        this._textures.pushBack(textureInfo);
      }

      callback(textureInfo);
    };
    img.src = fileName;
  }

  /**
   * 画像の解放
   *
   * 配列に存在する画像全てを解放する。
   */
  public releaseTextures(): void {
    for (let i = 0; i < this._textures.getSize(); i++) {
      this._textures.set(i, null);
    }

    this._textures.clear();
  }

  /**
   * 画像の解放
   *
   * 指定したテクスチャの画像を解放する。
   * @param texture 解放するテクスチャ
   */
  public releaseTextureByTexture(texture: WebGLTexture): void {
    for (let i = 0; i < this._textures.getSize(); i++) {
      if (this._textures.at(i).id != texture) {
        continue;
      }

      this._textures.set(i, null);
      this._textures.remove(i);
      break;
    }
  }

  /**
   * 画像の解放
   *
   * 指定した名前の画像を解放する。
   * @param fileName 解放する画像ファイルパス名
   */
  public releaseTextureByFilePath(fileName: string): void {
    for (let i = 0; i < this._textures.getSize(); i++) {
      if (this._textures.at(i).fileName == fileName) {
        this._textures.set(i, null);
        this._textures.remove(i);
        break;
      }
    }
  }

  _textures: csmVector<TextureInfo>;
}

/**
 * 画像情報構造体
 */
export class TextureInfo {
  img: HTMLImageElement; // 画像
  id: WebGLTexture = null; // テクスチャ
  width = 0; // 横幅
  height = 0; // 高さ
  usePremultply: boolean; // Premult処理を有効にするか
  fileName: string; // ファイル名
}

class Image {
  onload = function () { }
  res = undefined
  _src = ''
  width = 0
  height = 0

  set src(value) {
    this._src = value
    self[value] = this
    this.download()
  }

  get src() {
    return this._src
  }

  download() {
    fetch(this.src, {
      headers: {
        "Content-Type": "image/png"
      }
    }).then(res => res.arrayBuffer())
      .then(async buffer => {
        // console.log(blob)

        // this.res =new ImageData((new Uint8ClampedArray(buffer)), 256, 256)
        let imageDecoder = new ImageDecoder({
          type: "image/png",
          data: buffer
        });
        const { image } = await imageDecoder.decode()
        this.height = image.displayHeight
        this.width = image.displayWidth
        const buf = new Uint8ClampedArray(this.height * this.width * 4)
        console.log(image, 'image')
        await image.copyTo(buf)
        swapU8CA(buf)
        const id =  new ImageData(buf, this.width, this.height)


        this.res =id
        this.onload()
      })
  }
}

function swapU8CA(array) {
  for (let i = 0; i < array.length; i += 4) {
    const temp = array[i]
    array[i] = array[i + 2]
    array[i + 2] = temp
  }
}