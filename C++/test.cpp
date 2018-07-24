#include <iostream>
using namespace std;

int main()
{
    void (*f2)() f1()
    {
        　　　　int n = 999;
        　　　　void f2()
        {
            　　　　　　cout << 33; 　　　　
        }
        　　　　return f2;　　
    }
    (f1())();
}