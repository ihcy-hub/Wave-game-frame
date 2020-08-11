"use strict";
// import LocalStorageUtil from "../Utils/LocalStorageUtil";
// export default class SoundMg {
//     static isPlayMusic: boolean = true;
//     static musicVolume = 0.2;
//     static soundVolume = 0.4;
//     static init() {
//         SoundMg.isPlayMusic = LocalStorageUtil.getBoolean("isPlayMusic", true);
//         if (SoundMg.isPlayMusic) {
//             this.playMusic();
//             this.playBgm();
//         } else {
//             this.stopMusic();
//         }
//     }
//     static stopMusic() {
//         SoundMg.isPlayMusic = false;
//         Laya.SoundManager.musicVolume = 0;
//         Laya.SoundManager.soundVolume = 0;
//     }
//     static playMusic() {
//         SoundMg.isPlayMusic = true;
//         Laya.SoundManager.musicVolume = this.musicVolume;
//         Laya.SoundManager.soundVolume = this.soundVolume;
//     }
//     static playBgm(path: string = "music/bgm.mp3") {
//         Laya.SoundManager.playMusic(path, 0);
//     }
//     static playSound(name: string, isStopBefor = false, isLoop = false) {
//         if (SoundMg.isPlayMusic && name) {
//             if (isStopBefor) {
//                 Laya.SoundManager.stopAllSound();
//             }
//             Laya.SoundManager.playSound("music/" + name + ".mp3", isLoop ? 0 : 1);
//         }
//     }
//     static stopAllSound() {
//         Laya.SoundManager.stopAllSound();
//     }
// }
// export class SoundName {
//     static click = "click";
//     static level_up = "level_up";
//     static gold_out = "gold_out";
// }
