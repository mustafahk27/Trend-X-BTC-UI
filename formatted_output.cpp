#include <iostream>
#include <string>
#include <iomanip>

using namespace std;

void printTitle(const string& title) {
    cout << "\n" << string(50, '*') << "\n";
    cout << setw(25 + title.length()/2) << title << "\n";
    cout << string(50, '*') << "\n";
}

void printSection(const string& section) {
    cout << "\n" << section << "\n";
    cout << string(section.length(), '-') << "\n";
}

void printSubsection(const string& subsection) {
    cout << "\n  " << subsection << "\n";
    cout << "  " << string(subsection.length(), '~') << "\n";
}

void printBulletPoint(const string& point) {
    cout << "  • " << point << "\n";
}

void printNumberedPoint(int num, const string& point) {
    cout << "  " << num << ". " << point << "\n";
}

int main() {
    // Main Title
    printTitle("Document Structure Example");

    // Key Features Section
    printSection("Key Features");
    printBulletPoint("Clean paragraph separation with proper spacing");
    printBulletPoint("Strategic use of bullet points for lists");
    printBulletPoint("Clear hierarchy with headings and subheadings");
    printBulletPoint("Professional formatting throughout");

    // Section 1
    printSection("Section 1: Structure");
    cout << "\nThe content is organized into logical sections, each with its own\n"
         << "heading. This makes it easy to scan and find specific information.\n\n"
         << "Each paragraph stands alone, separated by whitespace for better\n"
         << "readability.\n";

    // Section 2
    printSection("Section 2: Formatting Examples");
    
    printSubsection("Subsection A");
    printNumberedPoint(1, "Numbered lists when sequence matters");
    printNumberedPoint(2, "Each point is clear and concise");
    printNumberedPoint(3, "Proper indentation maintained");

    printSubsection("Subsection B");
    printBulletPoint("Bullet points for unordered lists");
    printBulletPoint("Short, focused points");
    printBulletPoint("Easy to scan quickly");

    // Conclusion
    printSection("Conclusion");
    cout << "\nThe conclusion wraps up the main points succinctly. It maintains\n"
         << "the same clean formatting established throughout the document.\n\n";

    cout << string(50, '-') << endl;
    return 0;
} 