import json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
names=['函数与极限','导数与微分','微分中值定理与导数的应用','不定积分','定积分','定积分的应用','微分方程','向量代数与空间解析几何','多元函数微分法及其应用','重积分','曲线积分与曲面积分','无穷级数']
desc=['从变化的趋势出发，建立微积分的第一块基石。','用切线与变化率，理解局部的数学规律。','把导数变成研究函数与解决问题的工具。','逆着求导的方向，寻找所有原函数。','从无限细分到整体累积，连接微分与积分。','让面积、体积、弧长与物理量拥有统一的语言。','用函数与导数的关系，描述动态世界。','建立空间坐标与方向的几何直觉。','从一条曲线走向多维空间中的变化。','在平面与空间里，计算更广泛的累积量。','沿着曲线和曲面，理解流动与环流。','用无穷多项，逼近函数与周期信号。']
icons=['limit','derivative','curve','integral','area','shape','equation','vector','gradient','double','flux','series']
optional={5:[5],7:[9,10],9:[9,10],10:[5],12:[6]}
chapters=[dict(id=i+1,title=n,description=desc[i],icon=icons[i],volume='上册' if i<7 else '下册',lessons=[]) for i,n in enumerate(names)]
lessons=[]
for line in (root/'scripts/course.txt').read_text().splitlines():
 if not line:continue
 if line.startswith('#'): ch=int(line[1:]);continue
 p=line.split('|')
 assert len(p)==13,(ch,p[0],len(p))
 title,intro,key,formula,example,steps,pitfall,question,options,explain,fill,answer,fexplain=p
 chapter=chapters[ch-1]; num=len(chapter['lessons'])+1; lid=f'{ch}-{num}'
 opts=options.split(';'); assert len(opts)==4
 shift=(ch+num)%4; opts=opts[shift:]+opts[:shift]; correct=(-shift)%4
 lesson=dict(id=lid,chapter=ch,number=num,title=title,intro=intro,key=key,formula=formula,example=example,steps=steps.split('~'),pitfall=pitfall,optional=num in optional.get(ch,[]),minutes=10+(num%4)*2,quiz=[dict(id=lid+'-c',type='choice',prompt=question,options=opts,correct=correct,explain=explain),dict(id=lid+'-f',type='fill',prompt=fill,answers=answer.split(';'),explain=fexplain)])
 lessons.append(lesson); chapter['lessons'].append(lid)
assert [len(c['lessons']) for c in chapters]==[10,5,8,5,5,3,10,6,10,5,7,8]
(root/'dist/data.js').write_text('window.COURSE='+json.dumps(dict(chapters=chapters,lessons=lessons),ensure_ascii=False)+';\n')
print(f'Built {len(chapters)} chapters, {len(lessons)} lessons, {len(lessons)*2} exercises')
