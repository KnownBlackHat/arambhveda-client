import college1 from "@/assets/college-1.jpg";
import college2 from "@/assets/college-2.jpg";
import college3 from "@/assets/college-3.jpg";
import college4 from "@/assets/college-4.jpg";
import college5 from "@/assets/college-5.jpg";
import college6 from "@/assets/college-6.jpg";

const collegeImages = [college1, college2, college3, college4, college5, college6];

export function getCollegeImage(collegeId: number): string {
  return collegeImages[(collegeId - 1) % collegeImages.length];
}
