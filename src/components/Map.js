import { useEffect, useRef, useState } from "react";
import * as defaultGetData from "../data_from_server.json";
import * as React from "react";
import AnimatedPopup from 'mapbox-gl-animated-popup';
import {View,Dimensions,SafeAreaView,StyleSheet,} from "react-native";
import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker";
mapboxgl.accessToken =
  "pk.eyJ1IjoiaGVjdG9yY2hjaCIsImEiOiJja205YmhldXUwdHQ1Mm9xbGw4N2RodndhIn0.yX90QKE2jcgG-7V5wOGXeQ";
mapboxgl.workerClass = MapboxWorker;
var NUM_OF_CP = 0;
var CP_LOCATION = [];
var markers = [];
var NUM_OF_marker = 0;
const Map = () =>{
const mapContainer = useRef();
const [lng, setLng] = useState(114.2655);
const [lat, setLat] = useState(22.3364);
const [zoom, setZoom] = useState(16);
const [getData, setGetData] = useState(defaultGetData);
const [mapState, setMap] = useState(null);
const [popup, setPopup] = useState(null);
const [marker, setMarker] = useState(null);
    useEffect(() => {
        
        var map = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [lng, lat],
          zoom: zoom,
        });
        map.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          })
        );
        var highlightLayer = {
            id: 'highlight',
            type: 'custom',
             
            // method called when the layer is added to the map
            // https://docs.mapbox.com/mapbox-gl-js/api/#styleimageinterface#onadd
            onAdd: function (map, gl) {
            // create GLSL source for vertex shader
            var vertexSource =
            '' +
            'uniform mat4 u_matrix;' +
            'attribute vec2 a_pos;' +
            'void main() {' +
            '    gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);' +
            '}';
             
            // create GLSL source for fragment shader
            var fragmentSource =
            '' +
            'void main() {' +
            '    gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);' +
            '}';
             
            // create a vertex shader
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, vertexSource);
            gl.compileShader(vertexShader);
             
            // create a fragment shader
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, fragmentSource);
            gl.compileShader(fragmentShader);
             
            // link the two shaders into a WebGL program
            this.program = gl.createProgram();
            gl.attachShader(this.program, vertexShader);
            gl.attachShader(this.program, fragmentShader);
            gl.linkProgram(this.program);
             
            this.aPos = gl.getAttribLocation(this.program, 'a_pos');
             
            // define vertices of the triangle to be rendered in the custom style layer
            var helsinki = mapboxgl.MercatorCoordinate.fromLngLat({
            lng: 114.2650,
            lat: 22.3360
            });
            var berlin = mapboxgl.MercatorCoordinate.fromLngLat({
            lng: 114.2655,
            lat: 22.3354
            });
            var kyiv = mapboxgl.MercatorCoordinate.fromLngLat({
            lng: 114.2660,
            lat: 22.3370
            });
             
            // create and initialize a WebGLBuffer to store vertex and color data
            this.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
            helsinki.x,
            helsinki.y,
            berlin.x,
            berlin.y,
            kyiv.x,
            kyiv.y
            ]),
            gl.STATIC_DRAW
            );
            },
             
            // method fired on each animation frame
            // https://docs.mapbox.com/mapbox-gl-js/api/#map.event:render
            render: function (gl, matrix) {
            gl.useProgram(this.program);
            gl.uniformMatrix4fv(
            gl.getUniformLocation(this.program, 'u_matrix'),
            false,
            matrix
            );
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.enableVertexAttribArray(this.aPos);
            gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
            }
            };
             
            // add the custom style layer to the map
            map.on('load', function () {
            map.addLayer(highlightLayer, 'building');
            });
        
            map.on('click', function(e) {
              var coordinates = e.lngLat;
              //send to the server
              var templat = parseFloat(coordinates.lat);
              var templng = parseFloat(coordinates.lng);
              setMap(map);
              //push to the server
              const name = 'Setting here as check point';
              const innerHtmlContent = `<div style="min-width: 600px;font-size: middle;color : black;">
                          <h4 class="h4Class">${name} </h4> </div>`;
              
              const divElement = document.createElement('div');
              const assignBtn = document.createElement('div');
              assignBtn.innerHTML = `<button class="btn btn-success btn-simple text-white" >Reset</button>`;
              const assignBtn2 = document.createElement('div');
              assignBtn2.innerHTML = `<button class="btn btn-success btn-simple text-white" >Confirm</button>`;
              divElement.innerHTML = innerHtmlContent;
              divElement.appendChild(assignBtn);
              divElement.appendChild(assignBtn2);
              assignBtn.addEventListener('click', (e) => {
                console.log("cancel button clicked");
                for (let i = 0; i < NUM_OF_marker; ++i) {
                      markers[i].remove();
                      console.log(i);
                }
                NUM_OF_marker=0; 
                NUM_OF_CP=0;
                CP_LOCATION=[];
                //console.log(NUM_OF_marker) 
                
              });
              assignBtn2.addEventListener('click', (e) => {
                console.log("confirm button clicked");
                var anynear = false;
                for (let i = 0; i < NUM_OF_CP; ++i) {
                    var displacement = Math.sqrt((templat-CP_LOCATION[i].latitude)*(templat-CP_LOCATION[i].latitude)+(templng-CP_LOCATION[i].longitude)*(templng-CP_LOCATION[i].longitude));
                    console.log(displacement);
                    if(displacement<0.002){
                        anynear = true;
                        alert("The point is too close")
                        break;
                    }
                    else{
                        continue
                    }
                }
                if(!anynear||NUM_OF_CP==0)
                {
                   CP_LOCATION.push({ latitude: templat, longitude: templng },);
                   NUM_OF_CP=NUM_OF_CP+1;
                   markers[NUM_OF_marker] = new mapboxgl.Marker({
                   scale: 2,
                   color: "White" ,
                   })
                   .setLngLat([CP_LOCATION[NUM_OF_CP-1].longitude, CP_LOCATION[NUM_OF_CP-1].latitude])
                   .addTo(map);
                   setMarker(markers[NUM_OF_marker]);
                    NUM_OF_marker=NUM_OF_marker+1  
                }      
                }); 
              var popup = new AnimatedPopup({
                openingAnimation: {
                    duration: 1000,
                    easing: 'easeOutElastic'
                },
                closingAnimation: {
                    duration: 300,
                    easing: 'easeInBack'
                }
              }).setLngLat([templng, templat]).addTo(map).setDOMContent(divElement); ;
            });
        return () => {
          map.remove();
        };
      }, []);
      useEffect
      return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mapContainer}>
        <div className="map-container" ref={mapContainer} />
        </View>
        <map />
        </SafeAreaView>
        );

    

}
  export default Map;
//ReactDOM.render(<Map />, document.getElementById('app'));
const styles = StyleSheet.create({
    container: {
        position: "absolute",
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
      },
    mapContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
      },
  });

  