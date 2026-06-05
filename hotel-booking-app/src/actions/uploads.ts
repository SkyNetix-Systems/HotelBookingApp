'use server'

import supabaseConfig from "@/config/supabase-config"

const BUCKET_NAME = 'hotels-rooms'

export const uploadFile = async (file: File) => {
  try {
    // Validate file
    if (!file) {
      return {
        success: false,
        message: 'No file provided',
        url: null,
      }
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name}`

    // Convert File to Buffer
    const fileBuffer = await file.arrayBuffer()

    // Upload to Supabase Storage
    const { data, error } = await supabaseConfig.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return {
        success: false,
        message: error.message || 'Failed to upload file',
        url: null,
      }
    }

    // Get public URL
    const { data: publicUrlData } = supabaseConfig.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName)

    if (!publicUrlData || !publicUrlData.publicUrl) {
      return {
        success: false,
        message: 'Failed to get public URL',
        url: null,
      }
    }

    return {
      success: true,
      message: 'File uploaded successfully',
      url: publicUrlData.publicUrl,
    }
  } catch (error: any) {
    console.error('Upload exception:', error)
    return {
      success: false,
      message: error.message || 'An error occurred during upload',
      url: null,
    }
  }
}