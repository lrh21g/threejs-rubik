import * as THREE from 'three'
import BasicRubik from './object/Rubik'

export default class Main {
  constructor(canvasDom) {
    this.canvas = canvasDom
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.viewCenter = new THREE.Vector3(0, 0, 0) // 原点
    this.frontViewName = 'front-rubik'// 正视角魔方名称
    this.endViewName = 'end-rubik'// 反视角魔方名称

    this.initThree()
    this.initCamera()
    this.initScene()
    this.initLight()
    this.initObject()
    this.render()
  }

  // 初始化渲染器
  initThree() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, // 是否执行抗锯齿。默认为false
      canvas: this.canvas, // 供渲染器绘制其输出的 canvas
    })
    // 设置设备像素比。通常用于避免HiDPI设备上绘图模糊
    this.renderer.setPixelRatio(window.devicePixelRatio)
    // 将输出 canvas 的大小调整为 (width, height) 并考虑设备像素比，且将视口从 (0, 0) 开始调整到适合大小
    this.renderer.setSize(this.width, this.height)
    // 设置颜色及其透明度
    this.renderer.setClearColor(0xFFFFFF, 0)
  }

  // 初始化相机
  initCamera() {
  // 定义了摄像机的 viewing frustum（视锥体）。
  // 使用 perspective projection（透视投影）来进行投影。
  // 该投影模式被用来模拟人眼所看到的景象，它是3D场景的渲染中使用得最普遍的投影模式。
    this.camera = new THREE.PerspectiveCamera(
      45, // fov ：摄像机视锥体垂直视野角度
      this.width / this.height, // aspect ：摄像机视锥体长宽比
      1, // near ：摄像机视锥体近端面
      1500, // far ：摄像机视锥体远端面
    )

    // 三维物体（Object3D） position ：表示对象局部位置的 Vector3 （三维向量）。默认值为(0, 0, 0)。
    // 三维向量（Vector3） set ：设置该向量的x、y 和 z 分量。
    // Z轴坐标需要除以屏幕宽高比，保证魔方在不同宽高比的屏幕中宽度所占的比例基本一致
    this.camera.position.set(0, 0, 280 / this.camera.aspect)
    // up ：由 lookAt 方法所使用，例如，来决定结果的朝向。默认值是 Object3D.DEFAULT_UP，即( 0, 1, 0 )。
    this.camera.up.set(0, 1, 0)// 正方向
    // 改变 .position 属性后，如果不执行 .lookAt() 方法，相机的观察方向默认不变。
    // 希望相机圆周运动的同时，改变相机视线方向，保持相机镜头始终指向坐标原点或其它位置，需要每次改变 .position 属性后，重新执行一遍 .lookAt() 方法
    this.camera.lookAt(this.viewCenter)

    // 透视投影相机视角为垂直视角，根据视角可以求出原点所在裁切面的高度，然后已知高度和宽高比可以计算出宽度
    this.originHeight = Math.tan(22.5 / 180 * Math.PI) * this.camera.position.z * 2
    this.originWidth = this.originHeight * this.camera.aspect
    // UI元素逻辑尺寸和屏幕尺寸比率
    this.uiRadio = this.originWidth / window.innerWidth
  }

  // 初始化场景
  // 场景能够让你在什么地方、摆放什么东西来交给 three.js 来渲染，这是你放置物体、灯光和摄像机的地方。
  initScene() {
    this.scene = new THREE.Scene()
  }

  // 初始化光线
  initLight() {
    // 创建一个环境光对象
    this.light = new THREE.AmbientLight(0xFEFEFE)
    this.scene.add(this.light)
  }

  // 初始化物体
  initObject() {
    this.frontRubik = new BasicRubik(this)
    this.frontRubik.model(this.frontViewName)
  }

  // 渲染
  render() {
    this.renderer.clear()

    if (this.tagRubik) {
      this.tagRubik.group.rotation.x += 0.01
      this.tagRubik.group.rotation.y += 0.01
    }

    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.render.bind(this), this.canvas)
  }
}
