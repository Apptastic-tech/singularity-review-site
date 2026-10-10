from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
FONT='/usr/share/fonts/truetype/sand-box/google/Orbitron/Orbitron-VariableFont_wght.ttf'
def font(px, weight='Bold'):
    f=ImageFont.truetype(FONT, px)
    try: f.set_variation_by_name(weight)
    except Exception as e: print('var',e)
    return f
def stamp(img, cx, cy, cap, weight='Bold', track=0.08):
    """Draw white 'AI' centered at (cx,cy) with cap height `cap` px, supersampled."""
    S=4; W,H=img.size
    layer=Image.new('L',(W*S,H*S),0); d=ImageDraw.Draw(layer)
    f=font(int(cap*S/0.72), weight)  # Orbitron cap height ~0.72 em
    # measure each glyph to apply tracking
    gA=d.textbbox((0,0),'A',font=f); gI=d.textbbox((0,0),'I',font=f)
    wA=gA[2]-gA[0]; wI=gI[2]-gI[0]; gap=cap*S*track*2
    tw=wA+gap+wI; top=gA[1]; ch=gA[3]-gA[1]
    x0=cx*S-tw/2; y0=cy*S-ch/2-top
    d.text((x0-gA[0],y0),'A',font=f,fill=255); d.text((x0+wA+gap-gI[0],y0),'I',font=f,fill=255)
    m=layer.resize((W,H),Image.LANCZOS)
    white=Image.new('RGB',(W,H),(246,244,238))
    return Image.composite(white,img.convert('RGB'),m)
src=Image.open('../logo-square.jpg').convert('RGB')
# shadow centre measured at (524,445); clear dark span ~ x 405..643, y 355..535
master=stamp(src,524,446,74,'Bold',0.10); master.save('logo-square-ai-1024.png'); master.save('logo-square-ai.jpg',quality=94,subsampling=0)
# Large icon crop (apple-touch, social avatar, header mark): centred on the shadow and ring
def crop(img,cx,cy,s): return img.crop((cx-s//2,cy-s//2,cx+s//2,cy+s//2))
big=crop(master,524,470,560)
big.resize((512,512),Image.LANCZOS).save('social-avatar.png')
big.resize((180,180),Image.LANCZOS).filter(ImageFilter.UnsharpMask(1,60,2)).save('apple-touch-icon.png')
for s in (96,128,192): big.resize((s,s),Image.LANCZOS).save(f'header-mark-{s}.png')
# Small favicons: tighter crop and a heavier, larger AI so it survives 32px
smallsrc=stamp(src,524,446,96,'Black',0.06)
small=crop(smallsrc,524,462,400)
for s in (32,48,64):
    small.resize((s,s),Image.LANCZOS).filter(ImageFilter.UnsharpMask(0.6,80,1)).save(f'favicon-{s}.png')
# Wide art for OG/FB cover
w=Image.open('../blackhole-wide.jpg').convert('RGB')
a=np.asarray(w.convert('L')).astype(int)
row=a[260,:]; d=[x for x in range(400,900) if row[x]<15]; print('wide row260', d[0], d[-1])
col=a[:, (d[0]+d[-1])//2]; v=[y for y in range(100,450) if col[y]<15]; print('wide col', v[0], v[-1])
# Avatar/profile set: tighter crop, larger AI for circular 40px use
av=stamp(src,524,446,90,'Bold',0.08)
pc=crop(av,524,468,600)
pc.resize((1024,1024),Image.LANCZOS).save('profile-ai-1024.jpg',quality=94,subsampling=0)
pc.resize((512,512),Image.LANCZOS).save('social-avatar.png')
pc.resize((180,180),Image.LANCZOS).filter(ImageFilter.UnsharpMask(1,60,2)).save('apple-touch-icon.png')
for s in (96,128,192): pc.resize((s,s),Image.LANCZOS).save(f'header-mark-{s}.png')
wide=stamp(Image.open('../blackhole-wide.jpg').convert('RGB'),650,300,62,'Bold',0.10)
wide.save('blackhole-wide-ai.jpg',quality=94,subsampling=0)
