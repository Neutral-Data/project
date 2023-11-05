package neutraldata.project.user;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import neutraldata.project.dto.SignUpDto;
import neutraldata.project.dto.UserDto;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toUserDto(User user);

    @Mapping(target = "password", ignore = true)
    User signUpToUser(SignUpDto signUpDto);

}
