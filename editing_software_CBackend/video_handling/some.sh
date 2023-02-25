#!/bin/bash
gcc image_saturation.c -o image_saturations -L/opt/local/lib -lavformat -lavcodec -lavutil 
# gcc -S image_saturation.c -o image_saturation.s
# ./image_saturation ./some.mov 