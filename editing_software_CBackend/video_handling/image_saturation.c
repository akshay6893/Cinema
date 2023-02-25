#include <libavformat/avformat.h>

int main(int argc, char *argv[]) {
    AVFormatContext *format_context = NULL;
    int video_stream_index = -1;
    AVCodecContext *codec_context = NULL;
    AVCodec *codec = NULL;
    AVFrame *frame = NULL;
    AVPacket packet;
    int frame_finished;

    // Initialize FFmpeg library
    av_register_all();

    // Open the input file
    // format_context is a pointer to an AVFormatContext structure that holds information about the format of an input file. avformat_open_input is a function from the FFmpeg library that opens an input file and fills the AVFormatContext structure with information about the file format and its contents.
    // The address of the format_context pointer (&format_context) is passed as the first argument to avformat_open_input because this function needs to fill the AVFormatContext structure that format_context points to. The second argument (argv[1]) is the file name to be opened, and the last two arguments (NULL) are options for opening the file and can be used to specify custom I/O or format-specific options.
    if (avformat_open_input(&format_context, argv[1], NULL, NULL) != 0) {
        printf("Could not open file\n");
        return -1;
    }

    // Retrieve stream information
    if (avformat_find_stream_info(format_context, NULL) < 0) {
        printf("Could not find stream information\n");
        return -1;
    }

    // Find the first video stream
    for (int i = 0; i < format_context->nb_streams; i++) {
        if (format_context->streams[i]->codec->codec_type == AVMEDIA_TYPE_VIDEO) {
            video_stream_index = i;
            break;
        }
    }
    if (video_stream_index == -1) {
        printf("Could not find a video stream\n");
        return -1;
    }

    // Get a pointer to the codec context for the video stream
    codec_context = format_context->streams[video_stream_index]->codec;

    // Find the decoder for the video stream
    codec = avcodec_find_decoder(codec_context->codec_id);
    if (codec == NULL) {
        printf("Unsupported codec\n");
        return -1;
    }

    // Open codec
    if (avcodec_open2(codec_context, codec, NULL) < 0) {
        printf("Could not open codec\n");
        return -1;
    }

    // Allocate video frame
    frame = av_frame_alloc();

    // Read frames from the file
    while (av_read_frame(format_context, &packet) >= 0) {
        // Is this a packet from the video stream?
        if (packet.stream_index == video_stream_index) {
            // Decode video frame
            avcodec_decode_video2(codec_context, frame, &frame_finished, &packet);

            // Did we get a video frame?
            if (frame_finished) {
                // Multiply all the pixels with a constant factor
                for (int y = 0; y < codec_context->height; y++) {
                    for (int x = 0; x < codec_context->width; x++) {
                        for (int plane = 0; plane < 3; plane++) {
                            int index = y * frame->linesize[plane] + x * 3 + plane;
                            frame->data[plane][index] = frame->data[plane][index]*3;
                        }
                    }
                }

            }
        }

        // Free the packet that was allocated by av_read_frame
        av_free_packet(&packet);
    }

    // Free the frame and close the codec
    av_free(frame);
    avcodec_close(codec_context);

    // Close the input file
    avformat_close_input(&format_context);

    return 0;
}