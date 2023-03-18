let SessionLoad = 1
if &cp | set nocp | endif
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/code/deployday/astro-nx-depla
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
argglobal
%argdel
$argadd libs/website/app/src/lib/website-app.ts
set stal=2
tabnew
tabnew
tabnew
tabnew
tabnew
tabnew
tabnew
tabnew
tabrewind
edit libs/website/entities/post/src/lib/website-entities-post.ts
set splitbelow splitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
argglobal
balt libs/website/entities/post/src/lib/config.ts
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 4 - ((3 * winheight(0) + 8) / 17)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
4
normal! 0
lcd ~/code/deployday/astro-nx-depla/libs/website/entities/post/src/lib
tabnext
edit ~/code/deployday/astro-nx-depla/libs/shared/ui/src/lib/MetaTags.astro
set splitbelow splitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
argglobal
balt ~/code/deployday/astro-nx-depla/apps/website/astro.config.ts
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 9 - ((8 * winheight(0) + 18) / 37)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
9
normal! 010|
lcd ~/code/deployday/astro-nx-depla/libs/shared/ui/src/lib
tabnext
edit ~/code/deployday/astro-nx-depla/libs/shared/ui/src/lib/Tags.astro
set splitbelow splitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
argglobal
balt ~/code/deployday/astro-nx-depla/libs/shared/layout/src/lib/BaseLayout.astro
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 1 - ((0 * winheight(0) + 15) / 31)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
1
normal! 0
lcd ~/code/deployday/astro-nx-depla/libs/shared/ui/src/lib
tabnext
edit ~/code/deployday/astro-nx-depla/libs/shared/ui/src/lib/PostsGrid.astro
set splitbelow splitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
argglobal
setlocal fdm=marker
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 6 - ((5 * winheight(0) + 15) / 31)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
6
normal! 016|
lcd ~/code/deployday/astro-nx-depla/libs/shared/ui/src/lib
tabnext
edit ~/code/deployday/astro-nx-depla/libs/shared/ui/src/lib/PostsList.astro
set splitbelow splitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
argglobal
setlocal fdm=marker
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 6 - ((5 * winheight(0) + 15) / 31)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
6
normal! 016|
lcd ~/code/deployday/astro-nx-depla/libs/shared/ui/src/lib
tabnext
edit ~/code/deployday/astro-nx-depla/libs/shared/ui/src/lib/Session.vim
set splitbelow splitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
argglobal
setlocal fdm=marker
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 241 - ((12 * winheight(0) + 13) / 26)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
241
normal! 014|
tabnext
edit ~/code/deployday/astro-nx-depla/libs/shared/layout/src/lib/MarkdownLayout.astro
set splitbelow splitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
argglobal
balt ~/code/deployday/astro-nx-depla/libs/shared/layout/src/lib/BaseLayout.astro
setlocal fdm=marker
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 4 - ((3 * winheight(0) + 15) / 31)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
4
normal! 010|
lcd ~/code/deployday/astro-nx-depla/libs/shared/layout/src/lib
tabnext
edit ~/code/deployday/astro-nx-depla/libs/website/app/src/lib/providers/environment.ts
set splitbelow splitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
argglobal
balt ~/code/deployday/astro-nx-depla/libs/website/app/src/lib/providers/config.ts
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 7 - ((6 * winheight(0) + 15) / 31)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
7
normal! 0
lcd ~/code/deployday/astro-nx-depla/libs/website/app/src/lib/providers
tabnext
edit ~/code/deployday/astro-nx-depla/apps/website/src/pages/404.astro
set splitbelow splitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
argglobal
balt ~/code/deployday/astro-nx-depla/apps/website/src/pages/index.astro
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 21 - ((13 * winheight(0) + 8) / 17)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
21
normal! 012|
lcd ~/code/deployday/astro-nx-depla/apps/website/src/pages
tabnext 6
set stal=1
badd +3 ~/code/deployday/astro-nx-depla/libs/website/app/src/lib/website-app.ts
badd +0 ~/code/deployday/astro-nx-depla/libs/website/app/src/lib/providers/db.ts
badd +1 ~/code/deployday/astro-nx-depla/libs/website/entities/post/.babelrc
badd +3 ~/code/deployday/astro-nx-depla/libs/website/entities/post/tsconfig.json
badd +1 ~/code/deployday/astro-nx-depla/libs/website/entities/post/src/lib/website-entities-post.ts
badd +0 ~/code/deployday/astro-nx-depla/libs/website/entities/post/src/lib/config.ts
badd +15 ~/code/deployday/astro-nx-depla/apps/website/astro.config.ts
badd +0 ~/code/deployday/astro-nx-depla/libs/website/app/src/lib/providers/environment.ts
badd +0 ~/code/deployday/astro-nx-depla/libs/website/app/src/lib/providers/config.ts
badd +6 ~/code/deployday/astro-nx-depla/libs/shared/ui/src/lib/MetaTags.astro
badd +0 ~/code/deployday/astro-nx-depla/apps/website/src/pages/404.astro
badd +0 ~/code/deployday/astro-nx-depla/apps/website/src/pages/index.astro
badd +1 ~/code/deployday/astro-nx-depla/libs/shared/types/html/src/lib/shared-types-html.ts
badd +0 ~/code/deployday/astro-nx-depla/libs/website/types/src/lib/website-types.ts
badd +0 ~/code/deployday/astro-nx-depla/libs/shared/types/html/src/index.ts
badd +4 ~/code/deployday/astro-nx-depla/libs/shared/layout/src/lib/PageLayout.astro
badd +7 ~/code/deployday/astro-nx-depla/libs/shared/layout/src/lib/BaseLayout.astro
badd +0 ~/code/deployday/astro-nx-depla/libs/shared/layout/src/lib/MarkdownLayout.astro
badd +0 ~/code/deployday/astro-nx-depla/libs/shared/ui/src/lib/Tags.astro
badd +0 ~/code/deployday/astro-nx-depla/libs/shared/ui/src/lib/PostsList.astro
badd +0 ~/code/deployday/astro-nx-depla/libs/shared/ui/src/lib/Session.vim
badd +0 ~/code/deployday/astro-nx-depla/libs/shared/ui/src/lib/PostsGrid.astro
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=999 winwidth=84 shortmess=filnxtToOScA
set winminheight=5 winminwidth=1
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
let g:this_session = v:this_session
let g:this_obsession = v:this_session
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
