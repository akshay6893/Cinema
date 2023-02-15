#include "stdio.h"

int main(void) {
    int some = 5;
    int *variable= NULL;
    variable= &some;
    printf("The address of variable is %d\n", (int)(&variable));
    printf("The value of variable is %d\n", (int)(variable));


    return 0;
}



//          address      value
//    a       55           5  
//    b       56           55  
//

// int main(void){

//     int a = 5;
//     int *b = &a; 

//     printf("The value of a is %d\n", a);
//     printf("The address of a is %d\n", (int)&a);
//     printf("The address stored in pointer b is %d\n", (int)b);
//     printf("The address of pointer b is %d\n", (int)&b);
//     printf("The reference value of the pointer b is %lu\n", sizeof(char));
//     printf("The reference value of the pointer b is %lu\n", sizeof(uint8_t));

//     printf("The reference value of the pointer b is %lu\n", sizeof(int));

//     printf("The reference value of the pointer b is %lu\n", sizeof(int64_t));

//     // printf("The reference value of the pointer b is %lu\n", sizeof(uint8_t));


//     return 0;
// }

