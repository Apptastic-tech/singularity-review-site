from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageFilter
SERIF='/usr/share/fonts/truetype/sand-box/google/Newsreader/Newsreader-VariableFont_opsz,wght.ttf'
SKY='/workspace/sky/kittpeak-neutral-full.jpg'; BH='../ai/blackhole-wide-ai.jpg'
def compose(W,H,cx,cy,bw,word_px,word_y,horizon,out_path,skyscale=1.0,word_x=None):
    sky=Image.open(SKY).convert('RGB')
    s=W*skyscale/sky.width; sky=sky.resize((round(W*skyscale),round(sky.height*s)),Image.LANCZOS)
    off=sky.height-H; bg=sky.crop((0,off,W,off+H))
    bh=Image.open(BH).convert('RGB'); bh=bh.resize((bw,round(bh.height*bw/bh.width)),Image.LANCZOS)
    m=Image.new('L',bh.size,0); ImageDraw.Draw(m).ellipse((int(bw*.07),int(bh.height*.05),int(bw*.93),int(bh.height*.95)),fill=255); m=m.filter(ImageFilter.GaussianBlur(bw//12))
    bh=Image.composite(bh,Image.new('RGB',bh.size),m)
    layer=Image.new('RGB',(W,H)); layer.paste(bh,(cx-bw//2,cy-bh.height//2))
    hm=Image.new('L',(W,H),255); ImageDraw.Draw(hm).rectangle((0,horizon,W,H),fill=0); hm=hm.filter(ImageFilter.GaussianBlur(40))
    layer=Image.composite(layer,Image.new('RGB',(W,H)),hm)
    # keep the shadow (and its AI) opaque over the sky: darken a disc under the shadow first
    sh=Image.new('L',(W,H),0); r=int(bw*0.083); sx,sy=cx+int((650-640)*bw/1280),cy+int((300-360)*bw/1280)
    ImageDraw.Draw(sh).ellipse((sx-r,sy-r,sx+r,sy+r),fill=255); sh=sh.filter(ImageFilter.GaussianBlur(3))
    bg=Image.composite(Image.new('RGB',(W,H)),bg,sh)
    out=ImageChops.screen(bg,layer)
    d=ImageDraw.Draw(out); f=ImageFont.truetype(SERIF,word_px)
    try: f.set_variation_by_axes([500,36])
    except Exception as e: print(e)
    d.text((word_x if word_x is not None else cx,word_y),"Singularity Review",font=f,fill=(244,241,234),anchor="ms")
    out.save(out_path,quality=92,subsampling=0); return out
W,H=1640,924
out=compose(W,H,560,270,820,88,560,700,'fb-cover-v3-1640x924.jpg')
pv=out.copy(); pd=ImageDraw.Draw(pv)
pd.rectangle((0,150,W-1,774),outline=(242,169,59),width=3); pd.rectangle((180,0,1460,H-1),outline=(80,200,255),width=3)
pv.save('fb-cover-v3-safe-area-preview.jpg',quality=80)
compose(1200,630,420,200,660,74,430,520,'og-default-ai-1200x630.jpg',skyscale=1.25,word_x=420)
