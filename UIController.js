/**
 * Created by ian0214 on 17/10/28.
 */
var skt = new ReconnectingWebSocket("ws://114.212.242.132:9090/NJU-CloudComputing");
var dataList = new DataList();
skt.onopen = function () {
    console.info("socket 已打开")
};

skt.onmessage = function (msg) {
    // console.log(msg);
    var data = msg.data;
    if (data.indexOf("done")!== -1) {
        console.log("period done");
        var list = dataList.getPeriod();
        // console.log(list.ratios);
        for(var i=0;i<brandEles.length;i++){
            var brandEle = brandEles[i];
            var brandCount = list.counts[i];
            var brandRatio = list.ratios[i];
            brandEle.total = brandCount;
            brandEle.style.height = brandRatio+"%";
        }
    } else {
        var dataArray = data.split(":");
        var name = dataArray[0];
        var cnt = parseInt(dataArray[1], 10);
        dataList.set(name, cnt);
        // console.log("set=>"+name+" "+cnt);
    }
};

skt.onerror = function () {
    alert("连接错误")
};

function DataList() {
    var self = this;
    this.brandName = ["联想", "戴尔", "华硕", "惠普", "小米", "宏碁", "苹果", "华为", "三星", "神州", "其他"]
    this.brandCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.total = 0;

    this.set = function (name, count) {
        this.brandName.forEach(function (brandName, index) {
            if(name === brandName){
                self.brandCount[index] = count;
                self.total += count;
            }
        })
    };

    this.clear = function () {
        for(var i=0;i<this.brandCount.length; i++){
            this.brandCount[i] = 0;
        }
        this.total = 0;
    };

    this.getPeriod = function () {
        var ratios = [];
        var counts = [];
        this.brandCount.forEach(function (count) {
            counts.push(count);
            ratios.push(100*count/self.total)
        });
        // console.log(ratios);
        // console.log(counts);

        var rs = {
            total: this.total,
            names: this.brandName,
            counts: counts,
            ratios: ratios
        };

        this.clear();
        return rs;
    }
}