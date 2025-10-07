import * as THREE from 'three'

// 基础模型参数
const BasicParams = {
  x: 0,
  y: 0,
  z: 0,
  defaultColor: '#666666',
  // 魔方六个面的颜色数组：右、左、上、下、前、后
  colors: ['#ff6b02', '#dd422f', '#ffffff', '#fdcd02', '#3d81f7', '#019d53'],
  // 默认序列名
  sequences: ['R', 'L', 'U', 'D', 'F', 'B'],
}

/**
 * 简易魔方
 * @param {number} x 魔方中心点 x 轴坐标
 * @param {number} y 魔方中心点 y 轴坐标
 * @param {number} z 魔方中心点 z 轴坐标
 * @param {number} num 魔方阶数
 * @param {number} len 魔方小方块宽高
 * @param {string} colors 魔方六个面的颜色数组
 */
function SimpleCube(x, y, z, num, len, _colors) {
  // 魔方左上角坐标
  const leftUpX = x - (num / 2) * len // 魔方中心 x 轴坐标减去一半的宽度（宽度为 num * len）
  const leftUpY = y + (num / 2) * len // 魔方中心 y 轴坐标加上一半的宽度（宽度为 num * len）
  const leftUpZ = z + (num / 2) * len // 魔方中心 x 轴坐标加上一半的宽度（宽度为 num * len）

  const materialArr = [] // 材质数组
  // 遍历 BasicParams.colors 数组（预设的颜色数组），为每种颜色创建一个纹理贴图。
  for (let i = 0; i < BasicParams.colors.length; i++) {
    // Texture 创建一个纹理贴图，将其应用到一个表面，或者作为反射/折射贴图。
    const texture = new THREE.Texture(faces(BasicParams.colors[i]))
    // 更改了图像，画布，视频和数据纹理，则需要设置以下标志：texture.needsUpdate = true; 渲染对象就会自动更新。
    // needsUpdate 设置为true，以便在下次使用纹理时触发一次更新。
    texture.needsUpdate = true

    // Lambert网格材质(MeshLambertMaterial)：一种非光泽表面的材质，没有镜面高光。
    const material = new THREE.MeshLambertMaterial({
      map: texture, // 颜色贴图(Texture)。
    })
    materialArr.push(material)
  }

  // 创建默认材质（defaultMaterial）
  const defaultTexture = new THREE.Texture(faces(BasicParams.defaultColor))
  defaultTexture.needsUpdate = true
  const defaultMaterial = new THREE.MeshLambertMaterial({ map: defaultTexture })

  const cubes = []
  // 使用两层循环：外层循环i（z轴方向，层数），内层循环j（在每一层中，x-y平面上的小方块索引，从 0 到 num*num-1）。
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num * num; j++) {
      // 小方块外部面才有颜色，内部面默认为灰色
      const materials = []
      const no = i * num * num + j

      // x 坐标: no % num （决定了在该层内是第几列：no 除以每行的方块数 (num)，取余数，即可得到当前行内的第几个方块。）
      // y 坐标: no % num ** 2 / num （决定了在该层内是第几行：no % (num * num) 得到 no 在当前层内的偏移量（0 到 num * num - 1）；再将这个偏移量除以每行的方块数 (num)，取整数部分，即可得到当前层内的第几行。）
      // z 坐标: no / num ** 2 （决定了是第几层：no 除以每层的方块数 (num * num)，取整数部分，即可得到当前是第几层。）

      // z = 1（前面）
      // y=1  →  [0]    [1]     [2]
      // y=0  →  [3]    [4]     [5]
      // y=-1 →  [6]    [7]     [8]
      //         x=-1    x=0     x=1
      // z = 0（中间）
      // y=1  →  [9]    [10]    [11]
      // y=0  →  [12]   [13]    [14]
      // y=-1 →  [15]   [16]    [17]
      //         x=-1    x=0     x=1
      // z = -1（后面）
      // y=1  →  [18]   [19]    [20]
      // y=-1 →  [21]   [22]    [23]
      // y=0  →  [24]   [25]    [26]
      //         x=-1    x=0     x=1

      // 根据索引判断当前小方块是否属于某个外表面，并分配对应材质
      // 右：x 轴正方向
      // 在 3×3×3 魔方中，no % 3 === 2
      // 索引 2, 5, 8, 11, 14, 17, 20, 23, 26 是右面
      if (no % num === (num - 1)) {
        materials[0] = materialArr[0]
      }
      // 左：x 轴负方向
      // 在 3×3×3 魔方中，no % 3 === 0
      // 索引 0, 3, 6, 9, 12, 15, 18, 21, 24 是左面
      if (no % num === 0) {
        materials[1] = materialArr[1]
      }
      // 上：y 轴正方向
      // 在 3×3×3 魔方中，no % 9 <= 2
      // 索引 0, 1, 2, 9, 10, 11, 18, 19, 20 是上面
      if (no % (num ** 2) <= (num - 1)) {
        materials[2] = materialArr[2]
      }
      // 下：y 轴负方向
      // 在 3×3×3 魔方中，no % 9 >= 6
      // 索引 6, 7, 8, 15, 16, 17, 24, 25, 26 是下面
      if (no % (num ** 2) >= (num - 1) * num) {
        materials[3] = materialArr[3]
      }
      // 前：z 轴正方向（i=0 层）
      // 在 3×3×3 魔方中，parseInt(no / 9) === 0
      // 索引 0, 1, 2, 3, 4, 5, 6, 7, 8 是前面
      if (Number.parseInt(no / (num ** 2)) === 0) {
        materials[4] = materialArr[4]
      }
      // 后：z 轴负方向（i=num-1 层）
      // 在 3×3×3 魔方中，parseInt(no / 9) === 2
      // 索引 18, 19, 20, 21, 22, 23, 24, 25, 26 是后面
      if (Number.parseInt(no / (num ** 2)) === (num - 1)) {
        materials[5] = materialArr[5]
      }

      for (let k = 0; k < 6; k++) {
        if (!materials[k]) {
          materials[k] = defaultMaterial
        }
      }

      // 立方缓冲几何体（BoxGeometry）
      // BoxGeometry 是四边形的原始几何类，它通常使用构造函数所提供的 “width”、“height”、“depth” 参数来创建立方体或者不规则四边形。
      const cubegeo = new THREE.BoxGeometry(len, len, len)
      // 网格（Mesh）：表示基于以三角形为polygon mesh（多边形网格）的物体的类
      const cube = new THREE.Mesh(cubegeo, materials)

      // 依次计算各个小方块中心点坐标
      cube.position.x = (leftUpX + len / 2) + (j % num) * len
      cube.position.y = (leftUpY - len / 2) - Number.parseInt(j / num) * len
      cube.position.z = (leftUpZ - len / 2) - i * len
      cubes.push(cube)
    }
  }
  return cubes
}

// 生成 canvas 素材
function faces(rgbaColor) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  // 绘制一个宽高为 256 的黑色正方形
  ctx.fillStyle = 'rgba(0, 0, 0, 1)'
  ctx.fillRect(0, 0, 256, 256)

  // 在正方形内部使用 rgbaColor 绘制一个宽高为 224 的正方形，并用该颜色填充
  ctx.rect(16, 16, 224, 224) // 绘制矩形的路径 (起点横坐标, 起点纵坐标, 宽, 高)
  ctx.lineJoin = 'round' // 设置线条转角的样式： round - 圆角
  ctx.lineWidth = 16 // 设置线宽
  ctx.fillStyle = rgbaColor // 填充样式
  ctx.strokeStyle = rgbaColor // 设置描边样式
  ctx.stroke() // 对路径进行描边
  ctx.fill() // 路径填充

  return canvas
}

export default class Rubik {
  constructor(main) {
    this.main = main
    this.initStatus = []
    this.orderNum = 3// 默认三阶魔方
    this.cubeLen = 50// 默认小方块尺寸
  }

  // 创建方块
  createCube() {
    // 删除以前的物体
    this.initStatus = []

    if (this.container) {
      this.group.remove(this.container)
    }
    if (this.cubes && this.cubes.length > 0) {
      for (let i = 0; i < this.cubes.length; i++) {
        this.group.remove(this.cubes[i])
      }
    }

    this.cubes = SimpleCube(BasicParams.x, BasicParams.y, BasicParams.z, this.orderNum, this.cubeLen, BasicParams.colors)

    for (let i = 0; i < this.cubes.length; i++) {
      const item = this.cubes[i]
      // 由于筛选运动元素时是根据物体的id规律来的，但是滚动之后位置发生了变化
      // 再根据初始规律筛选会出问题，而且id是只读变量
      // 所以这里给每个物体设置一个额外变量cubeIndex，每次滚动之后更新根据初始状态更新该cubeIndex，让该变量一直保持初始规律即可
      this.initStatus.push({
        x: item.position.x,
        y: item.position.y,
        z: item.position.z,
        cubeIndex: item.id,
      })
      item.cubeIndex = item.id
      // 通过 add方 法把网格模型(mesh)作为设置为组对象 group 的子对象
      this.group.add(item)
    }

    const width = this.orderNum * this.cubeLen
    // 立方缓冲几何体（BoxGeometry）：通常使用构造函数所提供的 width、height、depth 参数来创建立方体或者不规则四边形。
    const cubegeo = new THREE.BoxGeometry(width, width, width)
    // 基础网格材质(MeshBasicMaterial) ：一个以简单着色（平面或线框）方式来绘制几何体的材质。
    const cubemat = new THREE.MeshBasicMaterial({
      opacity: 0, // 表明材质的透明度。值0.0表示完全透明，1.0表示完全不透明。
      transparent: true, // 定义此材质是否透明。
    })

    // 网格（Mesh）：表示基于以三角形为 polygon mesh（多边形网格）的物体的类。
    this.container = new THREE.Mesh(cubegeo, cubemat)
    this.container.cubeType = 'coverCube'
    this.group.add(this.container)
  }

  model(type) {
    // 通过 THREE.Group 类创建一个组对象 group
    this.group = new THREE.Group()
    this.group.childType = type

    this.createCube()

    // 进行一定的旋转变换保证三个面可视
    if (type === this.main.frontViewName) {
      // rotateY 将要旋转的角度（以弧度来表示，角度转弧度：弧度 = 角度 * π / 180）
      // 绕 Y 轴旋转 45 度
      this.group.rotateY(45 / 180 * Math.PI)
    }
    else {
      this.group.rotateY((270 - 45) / 180 * Math.PI)
    }

    // rotateOnAxis(axis: Vector3, angle: Float) 用于在局部空间中绕着物体的轴旋转一个物体
    // > axis: 一个表示旋转轴的 Vector3 对象。这个向量是相对于物体本身坐标系的，并且需要是单位向量。
    // > angle: 旋转的角度，以弧度表示。
    this.group.rotateOnAxis(new THREE.Vector3(1, 0, 1), 25 / 180 * Math.PI)

    this.showInScene()
  }

  // 显示在场景中
  showInScene() {
    this.isVisible = true
    this.main.scene.add(this.group)
  }

  // 隐藏
  hideInScene() {
    this.isVisible = false
    this.main.scene.remove(this.group)
  }
}
