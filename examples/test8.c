int factorial(int x) {
    if (x == 0) {
        return(1);
    } else {
        return (x * factorial(x - 1));
    }
}

int main() {
    int b;
    int z;
    z = 4;
    b = factorial(5);
    print(z);
    print(b);
}
