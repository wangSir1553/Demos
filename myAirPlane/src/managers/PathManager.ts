/*
* name;
*/
class PathManager{
    private static _compentPath:string = "comp/common/";
    private static _mapStr:string = "comp/map/";
    private static _sound:string = "res/sound/";
    public static compentPath(str:string):string{
        return `${this._compentPath}${str}.png`;
    }
    /**获取场景 */
    public static getMapByid(id:number):string{
        return `${this._mapStr}map_${id}.png`;
    }
    public static getSoundPath(name:string):string{
        return `${this._sound}${name}.mp3`;
    }
}