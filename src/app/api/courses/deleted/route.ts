import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import { withRateLimit, rateLimiters } from '@/lib/rate-limiter';

async function getDeletedCourses() {
  try {
    await dbConnect();
    
    // Sadece silinmiş kursları getir
    const deletedCourses = await Course.find({ isDeleted: true })
      .select('title description deletedAt deletedBy createdAt')
      .sort({ deletedAt: -1 });
    
    return NextResponse.json({
      success: true,
      count: deletedCourses.length,
      data: deletedCourses
    });
  } catch (error) {
    console.error('Error fetching deleted courses:', error);
    return NextResponse.json({ 
      error: 'Silinmiş kurslar yüklenirken hata oluştu' 
    }, { status: 500 });
  }
}

export const GET = withRateLimit(rateLimiters.admin)(getDeletedCourses);