/*

*/
var ctx, wid, hei, cols, rows, maze = [], stack = [], temp_start, start = { x: -1, y: -1 }, end = { x: -1, y: -1 }, grid = 16
var solve_speed = 100, generate_speed = 100
var isPlay = false
/**
 * drawMaze - 使用在迷宫数组中指定的颜色在画布上绘制迷宫
 */
function drawMaze() {

    // 遍历迷宫数组中的每个单元格
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            // 根据迷宫数组中的值设置填充样式
            switch (maze[i][j]) {
                case 0:
                    // 墙为黑色
                    ctx.fillStyle = "black"
                    break
                case 1:
                    // 起点为绿色
                    ctx.fillStyle = "green"
                    break
                case 2:
                    // 终点为红色
                    ctx.fillStyle = "red"
                    break
                case 3:
                    // 路为白色
                    ctx.fillStyle = "white"
                    break
                case 4:
                    // 路径
                    ctx.fillStyle = "blue"
                    break
                case 5:
                    // 回退的路径
                    ctx.fillStyle = "yellow"
                    break
            }
            // 使用指定的颜色填充单元格
            ctx.fillRect(grid * i, grid * j, grid, grid)
        }
    }
}


/**
 * 返回与给定节点值相同的相邻节点数组。
 * @param {number} sx - 节点的 x 坐标。
 * @param {number} sy - 节点的 y 坐标。
 * @param {number} a - 给定节点的值。
 * @returns {Array<{x: number, y: number}>} - 相邻节点的数组。
 */
function getFNeighbours(sx, sy, a) {
    var n = []

    // 检查左侧邻居
    if (sx - 1 > 0 && maze[sx - 1][sy] == a) {
        n.push({ x: sx - 1, y: sy })
    }

    // 检查右侧邻居
    if (sx + 1 < cols - 1 && maze[sx + 1][sy] == a) {
        n.push({ x: sx + 1, y: sy })
    }

    // 检查上方邻居
    if (sy - 1 > 0 && maze[sx][sy - 1] == a) {
        n.push({ x: sx, y: sy - 1 })
    }

    // 检查下方邻居
    if (sy + 1 < rows - 1 && maze[sx][sy + 1] == a) {
        n.push({ x: sx, y: sy + 1 })
    }
    return n
}

/**
 * 通过深度优先搜索算法解决迷宫。
 * 如果抵达终点，则重置迷宫。
 */
function solveMaze() {

    // 检查起点和终点是否相同
    // console.log(start, end)
    // if (start.x == end.x && start.y == end.y) {
    //     console.log("yyyyyyyyy")
    //     // 重置迷宫
    //     for (var i = 0; i < cols; i++) {
    //         for (var j = 0; j < rows; j++) {
    //             switch (maze[i][j]) {
    //                 // 将访问过的单元格改回未访问状态
    //                 case 4, 5: maze[i][j] = 3; break
    //                 case 1: maze[i][j] = 1; break
    //                 case 2: maze[i][j] = 2; break
    //                 // // 将路径单元格改回未访问状态
    //                 // case 3: maze[i][j] = 4; break
    //             }
    //         }
    //     }
    //     drawMaze()
    //     return
    // }
    // 获取当前单元格的邻居
    var neighbours = getFNeighbours(start.x, start.y, 3)
    var neighbours_done = getFNeighbours(start.x, start.y, 2)
    // 抵达终点
    if (neighbours_done.length) {
        return
    }

    // 如果有邻居，则移动到一个随机邻居
    if (neighbours.length) {
        stack.push(start)
        start = neighbours[Math.floor(Math.random() * neighbours.length)]
        maze[start.x][start.y] = 4
    } else {
        // 如果没有邻居，则回溯到上一个单元格
        maze[start.x][start.y] = 5
        start = stack.pop()
    }

    drawMaze()
    setTimeout(function () {
        requestAnimationFrame(solveMaze)
    }, solve_speed)
}

/**
 * 获取鼠标在网格上的位置，并处理迷宫的起点和终点。
 * @param {Event} event - 触发函数调用的鼠标事件。
 */
function getCursorPos(event) {
    // 获取网格的边界矩形
    var rect = this.getBoundingClientRect()

    // 根据网格和鼠标事件计算x和y坐标
    var x = Math.floor((event.clientX - rect.left) / grid),
        y = Math.floor((event.clientY - rect.top) / grid)

    // 如果为墙返回
    if (!maze[x][y]) return


    // 否则，将终点设置为当前单元格并解决迷宫

    if (!hasEnd() && !isPlay) {
        start = temp_start
        end = { x: x, y: y }
        maze[end.x][end.y] = 2
        solveMaze()
    }
}


/**
 * 返回与输入单元格具有相同值的相邻两个单元格列表。
 * 
 * @param {number} sx - 单元格的 x 坐标。
 * @param {number} sy - 单元格的 y 坐标。
 * @param {number} a - 输入单元格的值。
 * @returns {Array} - 与输入单元格具有相同值的相邻单元格列表。
 */
function getNeighbours(sx, sy, a) {
    var n = []
    // 检查左侧邻居
    if (sx - 1 > 0 && maze[sx - 1][sy] == a && sx - 2 > 0 && maze[sx - 2][sy] == a) {
        n.push({ x: sx - 1, y: sy }); n.push({ x: sx - 2, y: sy })
    }

    // 检查右侧邻居
    if (sx + 1 < cols - 1 && maze[sx + 1][sy] == a && sx + 2 < cols - 1 && maze[sx + 2][sy] == a) {
        n.push({ x: sx + 1, y: sy }); n.push({ x: sx + 2, y: sy })
    }

    // 检查上方邻居
    if (sy - 1 > 0 && maze[sx][sy - 1] == a && sy - 2 > 0 && maze[sx][sy - 2] == a) {
        n.push({ x: sx, y: sy - 1 }); n.push({ x: sx, y: sy - 2 })
    }

    // 检查下方邻居
    if (sy + 1 < rows - 1 && maze[sx][sy + 1] == a && sy + 2 < rows - 1 && maze[sx][sy + 2] == a) {
        n.push({ x: sx, y: sy + 1 }); n.push({ x: sx, y: sy + 2 })
    }

    return n
}

/**
 * 创建一个初始值为 1 的二维数组
 * @param {number} columns - 数组的列数
 * @param {number} rows - 数组的行数
 * @returns {number[][]} - 一个维度为 [columns, rows] 的二维数组
 */
function createArray(columns, rows) {
    // 初始化一个具有列数的数组
    const array = new Array(columns)

    // 遍历每一列
    for (let i = 0; i < columns; i++) {
        // 为列中的每一行初始化一个新数组
        array[i] = new Array(rows)
        // 遍历列中的每一行
        for (let j = 0; j < rows; j++) {
            // 将每个元素的初始值设为 0, 全都是墙
            array[i][j] = 0
        }
    }
    // 返回二维数组
    return array
}


/**
 * 使用随机深度优先搜索算法创建迷宫。
 * 如果没有可用的邻居，则通过堆栈回溯。
 * @return {void}
 */
function createMaze() {
    isPlay = true
    // 获取距离起始点为 2 的邻居。
    var neighbours = getNeighbours(start.x, start.y, 0),
        l
    if (neighbours.length < 1) {
        // 如果没有邻居，则通过堆栈回溯。
        if (stack.length < 1) {
            // 如果堆栈为空，解决问题
            drawMaze()
            stack = []
            isPlay = false
            // start.x = start.y = 1
            document.getElementById("canvas").addEventListener("click", getCursorPos, false)
            return
        }
        start = stack.pop()
    } else {
        // 随机选择两个邻居，创建路径
        var i = 2 * Math.floor(Math.random() * (neighbours.length / 2))
        l = neighbours[i]
        maze[l.x][l.y] = 3
        l = neighbours[i + 1]
        maze[l.x][l.y] = 3
        start = l
        stack.push(start)
    }
    // 绘制迷宫并请求动画的下一帧。
    drawMaze()
    setTimeout(function () {
        requestAnimationFrame(createMaze)
    }, generate_speed)
}


function initCanvas(w, h) {
    var canvas = document.getElementById("canvas")
    wid = w; hei = h
    canvas.width = wid; canvas.height = hei
    ctx = canvas.getContext("2d")
    ctx.fillStyle = "black"; ctx.fillRect(0, 0, wid, hei)
}

function reset() {
    isPlay = false
    maze = []
    stack = []
    start = { x: -1, y: -1 }
    end = { x: -1, y: -1 }
}

function mapValue(value, fromLow, fromHigh, toLow, toHigh) {
    // 将 value 从 from 区间映射到 0~1 的比例
    var fromRange = fromHigh - fromLow
    var toRange = toHigh - toLow
    var scale = (value - fromLow) / fromRange

    // 将 0~1 的比例映射到 to 区间
    return toLow + (scale * toRange)
}

function hasEnd() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (maze[i][j] == 2) return true
        }
    }
    return false
}

function init() {
    reset()
    gs = document.getElementById("gs").value
    ss = document.getElementById("ss").value
    generate_speed = mapValue(gs, 10, 100, 500, 10)
    solve_speed = mapValue(ss, 10, 100, 500, 10)
    cols = document.getElementById("col").value
    rows = document.getElementById("row").value
    initCanvas(grid * cols, grid * rows)
    maze = createArray(cols, rows)
    // 初始化起始点坐标为任一节点
    start.x = Math.floor(Math.random() * cols)
    start.y = Math.floor(Math.random() * rows)
    // if (!(start.x & 1)) start.x++; if (!(start.y & 1)) start.y++
    //起点
    maze[start.x][start.y] = 1
    temp_start = start
    createMaze()
}

document.getElementById("generate").addEventListener("click", () => init())
window.addEventListener("load", () => init())

