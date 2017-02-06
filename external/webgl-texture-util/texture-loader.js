/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

(function () {

var textureUtil;

function initTexture(tex, glTexture, stats) {
    var pixelsWide = stats.width;
    var pixelsHigh = stats.height;

    tex._pixelsWide = tex._contentSize.width = pixelsWide;
    tex._pixelsHigh = tex._contentSize.height = pixelsHigh;

    tex._webTextureObj = glTexture;
    tex._htmlElementObj = glTexture;

    tex.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURE);
    cc.glBindTexture2D(null);

    tex._pixelFormat = cc.Texture2D.PIXEL_FORMAT_PVRTC2;
    tex.maxS = 1;
    tex.maxT = 1;

    tex._hasPremultipliedAlpha = false;
    tex._hasMipmaps = false;

    //dispatch load event to listener.
    tex._textureLoaded = true;
    tex.dispatchEvent("load");
}

var webglTextureLoader = {
    load : function(realUrl, url, res, cb){
        if (!textureUtil) {
            textureUtil = new WebGLTextureUtil(cc._renderContext, true);
        }

        textureUtil.loadTexture(realUrl, null, function(glTexture, error, stats) {
            if (error) {
                return cb(error);
            }
            else {
                var tex = cc.textureCache.getTextureForKey(url) || new cc.Texture2D();
                tex.url = url;
            
                initTexture(tex, glTexture, stats);
                
                cc.textureCache.cacheImage(url, tex);
                cb(null, tex);
            }
        });
    }
};
cc.loader.register(["pvr"], webglTextureLoader);

})();