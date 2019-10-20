int main() {
    int i;
    bool j;
    i = 2;
    j = true;
    print(i);
    print(j);
    if (j) {
        print(999);
    }

    if (i) {
        print(999);
    }

    print(i + i);
    print(i + j);
}