import React, { useEffect,useState ,useRef} from "react";
import cloneDeep from 'lodash.clonedeep';
import "./Curves.scss"

function SaturationCurve() {

    const canvasRef = useRef(null);
    const startPoints = { x: 0, y: 0 }; 
    const Dimentions = { x: 255, y: 255 };
    const startPoints_rect = { x: 0, y: 0 };
    const Dimentions_rect = { x: 256, y: 256 };
    const tension_curve = 1; 
    const [controlPoint1, setControlPoint1] = useState([]);
    const [isDraggingControlPoint1, setisDraggingControlPoint1] = useState([]);
    
    function distance(x1,y1,x2,y2) {
        return Math.pow((x2-x1)**2+(y2-y1)**2,1/2)};
    function mid(x1,y1,x2,y2) {
        return [(x2+x1)/2,(y2+y1)/2]};
    function Down(event) {
        let clickNew = true
        for (let i=0; i<controlPoint1.length;   i++){
            if (event.pageX >= controlPoint1[i].x - 20 && event.pageX <= controlPoint1[i].x + 20 && event.pageY >= controlPoint1[i].y - 20 && event.pageY <= controlPoint1[i].y + 20) {
                const listOfBool = cloneDeep(isDraggingControlPoint1);
                listOfBool[i]=true;
                setisDraggingControlPoint1(listOfBool);
                clickNew = false
                break}};
        if (clickNew) {
            const merged_Point_list = [startPoints,...controlPoint1,Dimentions]
            const distances = []
            for (let n=1; n<merged_Point_list.length;   n++){
                const initial_point = merged_Point_list[n-1], end_point = merged_Point_list[n];
                const [mid_x,mid_y] = mid(initial_point.x,initial_point.y,end_point.x,end_point.y)
                distances.push(distance(mid_x,mid_y,event.pageX, event.pageY))};
            const minimum_value = Math.min(...distances);
            const index = distances.indexOf(minimum_value);

            const listOfDict_ = cloneDeep(controlPoint1);
            listOfDict_.splice(index, 0, { x: event.pageX, y: event.pageY });
            setControlPoint1(listOfDict_); 

            const listOfBool_ = cloneDeep(isDraggingControlPoint1);
            listOfBool_.splice(index, 0, true);
            setisDraggingControlPoint1(listOfBool_)}};
    function Move(event) {
        for (let i_=0; i_<isDraggingControlPoint1.length;i_++){
            if (isDraggingControlPoint1[i_]) {
                const listOfDict = cloneDeep(controlPoint1);
                listOfDict[i_]={ x: event.pageX, y: event.pageY };
                setControlPoint1(listOfDict); 
                break}}};
    function Up(event) {
        const listOfFalase = []
        for (let m of isDraggingControlPoint1 ){
            listOfFalase.push(false)}
        setisDraggingControlPoint1(listOfFalase)}
    function drawCurve(ctx, points,startPoints,Dimentions ,tension,width,color) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        var t = (tension != null) ? tension : 1;
        for (let i = 0; i < points.length - 1; i++) {
            var p0 = (i > 0) ? points[i - 1] : points[0];
            var p1 = points[i];
            var p2 = points[i + 1];
            var p3 = (i !== points.length - 2) ? points[i + 2] : p2;
            var cp1x = p1.x + (p2.x - p0.x) / 6 * t;
            var cp1y = p1.y + (p2.y - p0.y) / 6 * t;
            var cp2x = p2.x - (p3.x - p1.x) / 6 * t;
            var cp2y = p2.y - (p3.y - p1.y) / 6 * t;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y)};
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.stroke()
        const pixelData = ctx.getImageData(startPoints.x, startPoints.y, Dimentions.x, Dimentions.y).data;
        const CurveCord = [];
        const unique_list = [];
        for (var i = 0; i < pixelData.length; i += 4) {
            if (pixelData[i]===0){
                if (!unique_list.includes((i/4)%Dimentions.x)){
                    CurveCord.push([(i/4)%Dimentions.x , Math.floor((i/4)/Dimentions.x)])
                    unique_list.push((i/4)%Dimentions.x )
                }
            }};
        console.log(CurveCord)
        return CurveCord};
    function drawCircle(ctx, x, y, radius,width,color) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        for (let i = 0; i <= 360; i++) {
          let radians = (i * Math.PI) / 180;
          let xPos = x + radius * Math.cos(radians);
          let yPos = y + radius * Math.sin(radians);
          ctx.lineTo(xPos, yPos)};
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.stroke()};
    function drawLine(ctx, startPoints, Dimentions,width,color) {
        ctx.beginPath();
        ctx.moveTo(startPoints.x , startPoints.y);
        ctx.lineTo(Dimentions.x , Dimentions.y);
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.stroke()};
    function drawRect(ctx, startPoints, Dimentions,color) {
        ctx.clearRect(startPoints.x, startPoints.y, Dimentions.x, Dimentions.y);
        ctx.fillStyle = color;
        ctx.fillRect(startPoints.x, startPoints.y, Dimentions.x , Dimentions.y )};

        
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        drawRect(ctx,startPoints_rect,Dimentions_rect,'rgba(3, 3, 3, 0.6)')
        const CurveCordinates = drawCurve(ctx, [startPoints,...controlPoint1,Dimentions],startPoints_rect,Dimentions_rect,tension_curve,1.5,'black');
        drawLine(ctx, startPoints, Dimentions,2,'yellow')
        for (let dictionary of controlPoint1){
            drawCircle(ctx, dictionary.x, dictionary.y, 4,2,'white')};
      }, [controlPoint1]);

    return (
        <canvas className="slider" ref={canvasRef} width={Dimentions_rect.x} height={Dimentions_rect.y} onMouseDown={Down} onMouseMove={Move} onMouseUp={Up} />
    )};

export default SaturationCurve;


